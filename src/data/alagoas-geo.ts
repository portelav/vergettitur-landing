// Bbox geográfico de Alagoas e projeção lon/lat -> SVG. Fonte única de
// verdade compartilhada entre o mapa (silhuetas dos municípios, geradas por
// scripts/build-alagoas-geo.mjs) e os pinos das localidades (locations.ts).
// Qualquer mudança aqui exige regenerar `alagoas-municipios.ts`.
export const AL_BBOX = {
  lonMin: -38.35,
  lonMax: -35.05,
  latMin: -10.62,
  latMax: -8.7,
} as const;

export const AL_SVG_VIEWBOX = { width: 720, height: 760 } as const;

export function projectLatLon(lat: number, lon: number): { x: number; y: number } {
  const x =
    ((lon - AL_BBOX.lonMin) / (AL_BBOX.lonMax - AL_BBOX.lonMin)) *
    AL_SVG_VIEWBOX.width;
  const y =
    ((AL_BBOX.latMax - lat) / (AL_BBOX.latMax - AL_BBOX.latMin)) *
    AL_SVG_VIEWBOX.height;
  return { x, y };
}
