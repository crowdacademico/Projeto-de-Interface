export const TIPOS_CONTA = [
  {
    chave: 'apoiador',
    titulo: 'Quero apoiar',
    descricao: 'Contribua com campanhas de pesquisa e acompanhe os resultados que você ajudou a financiar.',
    icone: 'fa-hand-holding-heart',
  },
  {
    chave: 'pesquisador',
    titulo: 'Sou pesquisador',
    descricao: 'Submeta campanhas com seu perfil acadêmico público (Lattes, ORCID e outros).',
    icone: 'fa-flask',
  },
];

export const REQUISITOS_SENHA = [
  { chave: 'tamanho', rotulo: 'Pelo menos 8 caracteres', teste: (s) => s.length >= 8 },
  { chave: 'maiuscula', rotulo: 'Uma letra maiúscula', teste: (s) => /[A-Z]/.test(s) },
  { chave: 'numero', rotulo: 'Um número', teste: (s) => /[0-9]/.test(s) },
  { chave: 'simbolo', rotulo: 'Um símbolo (ex.: ! @ # $)', teste: (s) => /[^A-Za-z0-9]/.test(s) },
];

export const RESULTADO_LATTES_SIMULADO = {
  nome: 'Dr. Felipe Andrade Costa',
  instituicao: 'Universidade Federal de São Carlos (UFSCar)',
  area: 'Ciências Exatas e da Terra',
};
