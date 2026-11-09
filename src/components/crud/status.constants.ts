export const STATUS_CAMPANHA = {
  'em-captacao': {
    rotulo: 'Em captação',
    icone: 'fa-hand-holding-dollar',
    classe: 'fundo-aviso texto-aviso',
  },
  financiada: {
    rotulo: 'Financiada',
    icone: 'fa-circle-check',
    classe: 'badge-sucesso',
  },
  'nao-financiada': {
    rotulo: 'Não financiada',
    icone: 'fa-circle-info',
    classe: 'badge-neutro',
  },
  'em-breve': {
    rotulo: 'Em breve',
    icone: 'fa-clock',
    classe: 'fundo-institucional-sutil texto-institucional',
  },
} as const;
