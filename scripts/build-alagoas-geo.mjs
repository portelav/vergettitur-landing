// Gera src/data/alagoas-municipios.ts a partir do GeoJSON de municípios de
// Alagoas (tbrugz/geodata-br, fonte IBGE). Mesma técnica do mapa nacional
// de referência: Douglas-Peucker pra simplificar os polígonos, projeção
// linear lon/lat -> SVG.
//
// Uso: `node scripts/build-alagoas-geo.mjs`

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(__dirname, "_al_mun_raw.json");
const OUT = resolve(ROOT, "src/data/alagoas-municipios.ts");

// Bbox geográfico de Alagoas com folga visual. MANTER EM SYNC com
// `src/data/alagoas-geo.ts` (BBOX + projectLatLon) — os pinos das
// localidades usam a mesma projeção pra alinhar com os polígonos.
const BBOX = { lonMin: -38.35, lonMax: -35.05, latMin: -10.62, latMax: -8.7 };
const SVG_W = 720;
const SVG_H = 760;

const TOLERANCE = 0.006;
const MIN_POINTS = 5;

function projectLonLat(lon, lat) {
  const x = ((lon - BBOX.lonMin) / (BBOX.lonMax - BBOX.lonMin)) * SVG_W;
  const y = ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * SVG_H;
  return [x, y];
}

function perpDist(p, a, b) {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  const proj = [ax + t * dx, ay + t * dy];
  return Math.hypot(px - proj[0], py - proj[1]);
}

function dpSimplify(points, eps) {
  if (points.length <= 2) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    let maxD = 0;
    let idx = -1;
    for (let k = i + 1; k < j; k++) {
      const d = perpDist(points[k], points[i], points[j]);
      if (d > maxD) {
        maxD = d;
        idx = k;
      }
    }
    if (idx !== -1 && maxD > eps) {
      keep[idx] = 1;
      stack.push([i, idx]);
      stack.push([idx, j]);
    }
  }
  const out = [];
  for (let k = 0; k < points.length; k++) if (keep[k]) out.push(points[k]);
  return out;
}

function polygonCentroid(rings) {
  let sx = 0;
  let sy = 0;
  let sa = 0;
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[i + 1];
      const cross = x1 * y2 - x2 * y1;
      sx += (x1 + x2) * cross;
      sy += (y1 + y2) * cross;
      sa += cross;
    }
  }
  if (sa === 0) {
    const all = rings.flat();
    return [
      all.reduce((s, p) => s + p[0], 0) / all.length,
      all.reduce((s, p) => s + p[1], 0) / all.length,
    ];
  }
  sa /= 2;
  return [sx / (6 * sa), sy / (6 * sa)];
}

function polygonBbox(rings) {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lat < minLat) minLat = lat;
      if (lon > maxLon) maxLon = lon;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return { minLon, minLat, maxLon, maxLat };
}

const raw = JSON.parse(readFileSync(SRC, "utf8"));

const municipios = [];

for (const f of raw.features) {
  const id = f.properties.id ?? f.id;
  const name = f.properties.name;
  const geo = f.geometry;
  if (!geo) continue;

  const polygons =
    geo.type === "Polygon"
      ? [geo.coordinates]
      : geo.type === "MultiPolygon"
      ? geo.coordinates
      : [];
  if (polygons.length === 0) continue;

  const simplifiedPolys = polygons.map((rings) =>
    rings.map((ring) => {
      let s = dpSimplify(ring, TOLERANCE);
      if (s.length < MIN_POINTS) s = dpSimplify(ring, TOLERANCE / 2);
      const first = s[0];
      const last = s[s.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) s.push(first);
      return s;
    })
  );

  const main = simplifiedPolys.reduce((acc, cur) =>
    cur[0].length > acc[0].length ? cur : acc
  );
  const [cLon, cLat] = polygonCentroid(main);
  const [cx, cy] = projectLonLat(cLon, cLat);

  const { minLon, minLat, maxLon, maxLat } = polygonBbox(main);
  const [x1, y1] = projectLonLat(minLon, maxLat);
  const [x2, y2] = projectLonLat(maxLon, minLat);
  const bbox = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };

  const pathParts = [];
  for (const rings of simplifiedPolys) {
    for (const ring of rings) {
      const [first, ...rest] = ring;
      const [fx, fy] = projectLonLat(first[0], first[1]);
      pathParts.push(`M${fx.toFixed(1)} ${fy.toFixed(1)}`);
      for (const p of rest) {
        const [x, y] = projectLonLat(p[0], p[1]);
        pathParts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      pathParts.push("Z");
    }
  }

  municipios.push({
    id: String(id),
    name,
    path: pathParts.join(" "),
    centroid: { x: +cx.toFixed(1), y: +cy.toFixed(1) },
    bbox: {
      x: +bbox.x.toFixed(1),
      y: +bbox.y.toFixed(1),
      w: +bbox.w.toFixed(1),
      h: +bbox.h.toFixed(1),
    },
  });
}

// Ordena norte -> sul (centroide y crescente) pra stagger de entrada.
municipios.sort((a, b) => a.centroid.y - b.centroid.y);

const ts = `// Gerado por scripts/build-alagoas-geo.mjs — não editar manualmente.
// Fonte: tbrugz/geodata-br (GeoJSON IBGE de municípios), simplificado via
// Douglas-Peucker (epsilon=${TOLERANCE}°). Coordenadas SVG projetadas na
// bbox de \`src/data/alagoas-geo.ts\` (viewBox ${SVG_W}x${SVG_H}).
//
// Para regenerar: \`node scripts/build-alagoas-geo.mjs\`

export type AlagoasMunicipioGeometry = {
  id: string;
  name: string;
  path: string;
  centroid: { x: number; y: number };
  bbox: { x: number; y: number; w: number; h: number };
};

/** ${municipios.length} municípios de Alagoas, ordenados norte -> sul. */
export const ALAGOAS_MUNICIPIOS: ReadonlyArray<AlagoasMunicipioGeometry> = ${JSON.stringify(
  municipios,
  null,
  2
)};
`;

writeFileSync(OUT, ts);
console.log(`OK: ${municipios.length} municípios gerados.`);
console.log(`Output: ${OUT}`);
