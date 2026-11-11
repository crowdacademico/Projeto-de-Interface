// Áreas do conhecimento (tabela do CNPq): grande área -> subáreas. Vem do trabalho da Alexia (src/data/areas-conhecimento.ts
// na branch main), convertido de TypeScript para JavaScript puro. Cada projeto em 13-projetos.js tem grandeArea e subarea.
// Forma: { value: '1.00.00.00', label: 'Ciências Exatas e da Terra', subareas: [{ value, label }] }
export const GRANDES_AREAS_CONHECIMENTO = [
  {
    value: '1.00.00.00',
    label: 'Ciências Exatas e da Terra',
    subareas: [
      { value: '1.01.00.00', label: 'Matemática' },
      { value: '1.02.00.00', label: 'Probabilidade e Estatística' },
      { value: '1.03.00.00', label: 'Ciência da Computação' },
      { value: '1.04.00.00', label: 'Astronomia' },
      { value: '1.05.00.00', label: 'Física' },
      { value: '1.06.00.00', label: 'Química' },
      { value: '1.07.00.00', label: 'Geociências' },
      { value: '1.08.00.00', label: 'Oceanografia' },
    ],
  },
  {
    value: '2.00.00.00',
    label: 'Ciências Biológicas',
    subareas: [
      { value: '2.01.00.00', label: 'Biologia Geral' },
      { value: '2.02.00.00', label: 'Genética' },
      { value: '2.03.00.00', label: 'Botânica' },
      { value: '2.04.00.00', label: 'Zoologia' },
      { value: '2.05.00.00', label: 'Ecologia' },
      { value: '2.06.00.00', label: 'Morfologia' },
      { value: '2.07.00.00', label: 'Fisiologia' },
      { value: '2.08.00.00', label: 'Bioquímica' },
      { value: '2.09.00.00', label: 'Biofísica' },
      { value: '2.10.00.00', label: 'Farmacologia' },
      { value: '2.11.00.00', label: 'Imunologia' },
      { value: '2.12.00.00', label: 'Microbiologia' },
      { value: '2.13.00.00', label: 'Parasitologia' },
    ],
  },
  {
    value: '3.00.00.00',
    label: 'Engenharias',
    subareas: [
      { value: '3.01.00.00', label: 'Engenharia Civil' },
      { value: '3.02.00.00', label: 'Engenharia de Minas' },
      { value: '3.03.00.00', label: 'Engenharia de Materiais e Metalúrgica' },
      { value: '3.04.00.00', label: 'Engenharia Elétrica' },
      { value: '3.05.00.00', label: 'Engenharia Mecânica' },
      { value: '3.06.00.00', label: 'Engenharia Química' },
      { value: '3.07.00.00', label: 'Engenharia Sanitária' },
      { value: '3.08.00.00', label: 'Engenharia de Produção' },
      { value: '3.09.00.00', label: 'Engenharia Nuclear' },
      { value: '3.10.00.00', label: 'Engenharia de Transportes' },
      { value: '3.11.00.00', label: 'Engenharia Naval e Oceânica' },
      { value: '3.12.00.00', label: 'Engenharia Aeroespacial' },
      { value: '3.13.00.00', label: 'Engenharia Biomédica' },
    ],
  },
  {
    value: '4.00.00.00',
    label: 'Ciências da Saúde',
    subareas: [
      { value: '4.01.00.00', label: 'Medicina' },
      { value: '4.02.00.00', label: 'Odontologia' },
      { value: '4.03.00.00', label: 'Farmácia' },
      { value: '4.04.00.00', label: 'Enfermagem' },
      { value: '4.05.00.00', label: 'Nutrição' },
      { value: '4.06.00.00', label: 'Saúde Coletiva' },
      { value: '4.07.00.00', label: 'Fonoaudiologia' },
      { value: '4.08.00.00', label: 'Fisioterapia e Terapia Ocupacional' },
      { value: '4.09.00.00', label: 'Educação Física' },
    ],
  },
  {
    value: '5.00.00.00',
    label: 'Ciências Agrárias',
    subareas: [
      { value: '5.01.00.00', label: 'Agronomia' },
      { value: '5.02.00.00', label: 'Recursos Florestais e Engenharia Florestal' },
      { value: '5.03.00.00', label: 'Engenharia Agrícola' },
      { value: '5.04.00.00', label: 'Zootecnia' },
      { value: '5.05.00.00', label: 'Medicina Veterinária' },
      { value: '5.06.00.00', label: 'Recursos Pesqueiros e Engenharia de Pesca' },
      { value: '5.07.00.00', label: 'Ciência e Tecnologia de Alimentos' },
    ],
  },
  {
    value: '6.00.00.00',
    label: 'Ciências Sociais Aplicadas',
    subareas: [
      { value: '6.01.00.00', label: 'Direito' },
      { value: '6.02.00.00', label: 'Administração' },
      { value: '6.03.00.00', label: 'Economia' },
      { value: '6.04.00.00', label: 'Arquitetura e Urbanismo' },
      { value: '6.05.00.00', label: 'Planejamento Urbano e Regional' },
      { value: '6.06.00.00', label: 'Demografia' },
      { value: '6.07.00.00', label: 'Ciência da Informação' },
      { value: '6.08.00.00', label: 'Museologia' },
      { value: '6.09.00.00', label: 'Comunicação' },
      { value: '6.10.00.00', label: 'Serviço Social' },
      { value: '6.11.00.00', label: 'Economia Doméstica' },
      { value: '6.12.00.00', label: 'Desenho Industrial' },
      { value: '6.13.00.00', label: 'Turismo' },
    ],
  },
  {
    value: '7.00.00.00',
    label: 'Ciências Humanas',
    subareas: [
      { value: '7.01.00.00', label: 'Filosofia' },
      { value: '7.02.00.00', label: 'Sociologia' },
      { value: '7.03.00.00', label: 'Antropologia' },
      { value: '7.04.00.00', label: 'Arqueologia' },
      { value: '7.05.00.00', label: 'História' },
      { value: '7.06.00.00', label: 'Geografia' },
      { value: '7.07.00.00', label: 'Psicologia' },
      { value: '7.08.00.00', label: 'Educação' },
      { value: '7.09.00.00', label: 'Ciência Política' },
      { value: '7.10.00.00', label: 'Teologia' },
    ],
  },
  {
    value: '8.00.00.00',
    label: 'Linguística, Letras e Artes',
    subareas: [
      { value: '8.01.00.00', label: 'Linguística' },
      { value: '8.02.00.00', label: 'Letras' },
      { value: '8.03.00.00', label: 'Artes' },
    ],
  },
  {
    value: '9.00.00.00',
    label: 'Multidisciplinar',
    subareas: [
      { value: '9.01.00.00', label: 'Biotecnologia' },
      { value: '9.02.00.00', label: 'Ciências Ambientais' },
      { value: '9.03.00.00', label: 'Biodiversidade' },
      { value: '9.04.00.00', label: 'Ensino' },
      { value: '9.05.00.00', label: 'Materiais' },
    ],
  },
];

export const ROTULOS_AREA_POR_CODIGO = new Map();
for (const grandeArea of GRANDES_AREAS_CONHECIMENTO) {
  ROTULOS_AREA_POR_CODIGO.set(grandeArea.value, grandeArea.label);
  for (const subarea of grandeArea.subareas) {
    ROTULOS_AREA_POR_CODIGO.set(subarea.value, subarea.label);
  }
}

export const CODIGOS_GRANDES_POR_AREA_LEGADA = {
  biologicas: ['2.00.00.00'],
  exatas: ['1.00.00.00', '3.00.00.00'],
  saude: ['4.00.00.00'],
  humanas: ['7.00.00.00'],
};

export function obterSubareas(codigosGrandesAreas) {
  const selecionadas = new Set(codigosGrandesAreas);
  return GRANDES_AREAS_CONHECIMENTO
    .filter((grandeArea) => selecionadas.has(grandeArea.value))
    .flatMap((grandeArea) => grandeArea.subareas);
}
