export type Location = {
  id: string;
  name: string;
  /** Nome do município — precisa bater exato com `alagoas-municipios.ts`. */
  municipio: string;
  description: string;
  lat: number;
  lon: number;
};

// PLACEHOLDER: confirmar lista real de passeios com Adriano (ver docs/perguntas-adriano.md).
export const LOCATIONS: Location[] = [
  {
    id: "maragogi",
    name: "Piscinas Naturais de Maragogi",
    municipio: "Maragogi",
    description:
      "Águas cristalinas e recifes de corais, conhecido como o 'Caribe brasileiro'.",
    lat: -9.0114,
    lon: -35.2225,
  },
  {
    id: "gruta-de-pedra",
    name: "Gruta de Pedra Furada",
    municipio: "Japaratinga",
    description: "Formação rochosa natural em meio às piscinas de Japaratinga.",
    lat: -9.0839,
    lon: -35.2761,
  },
  {
    id: "sao-miguel",
    name: "São Miguel dos Milagres",
    municipio: "São Miguel dos Milagres",
    description: "Vilarejo tranquilo, coqueirais e piscinas naturais na maré baixa.",
    lat: -9.2411,
    lon: -35.3722,
  },
  {
    id: "barra-de-santo-antonio",
    name: "Barra de Santo Antônio",
    municipio: "Barra de Santo Antônio",
    description: "Piscinas naturais e passeio de jangada pelos rios que cercam a vila.",
    lat: -9.4056,
    lon: -35.5061,
  },
  {
    id: "praia-do-frances",
    name: "Praia do Francês",
    municipio: "Marechal Deodoro",
    description: "Uma das praias mais famosas de Alagoas, ideal para surf e passeios de jangada.",
    lat: -9.7539,
    lon: -35.8419,
  },
  {
    id: "foz-do-sao-francisco",
    name: "Foz do Rio São Francisco",
    municipio: "Piaçabuçu",
    description: "Encontro do rio com o mar, passeio de barco entre dunas e mangues.",
    lat: -10.5028,
    lon: -36.4108,
  },
];

export const BASE_MUNICIPIO = "Maceió";
