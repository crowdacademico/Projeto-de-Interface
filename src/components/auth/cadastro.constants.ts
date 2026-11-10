export const TIPOS_CONTA = [
  {
    chave: 'apoiador',
    titulo: 'Quero apoiar',
    descricao: 'Apoie campanhas de pesquisa e acompanhe os resultados.',
    icone: 'fa-hand-holding-heart',
  },
  {
    chave: 'pesquisador',
    titulo: 'Sou pesquisador',
    descricao: 'Crie seu perfil acadêmico e publique campanhas de pesquisa.',
    icone: 'fa-flask',
  },
] as const;

export type TipoConta = (typeof TIPOS_CONTA)[number]['chave'];
