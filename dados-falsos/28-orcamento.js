export const ORCAMENTO_RUBRICAS = [
    { rubrica: 'Reagentes e insumos de laboratório', valor: 12000 },
    { rubrica: 'Bolsa de iniciação científica (6 meses)', valor: 9600 },
    { rubrica: 'Equipamento de coleta e amostragem', valor: 7400 },
    { rubrica: 'Análise espectroscópica (terceirizada)', valor: 6000 },
];

export const ORCAMENTO_TOTAL = ORCAMENTO_RUBRICAS.reduce((soma, item) => soma + item.valor, 0);
