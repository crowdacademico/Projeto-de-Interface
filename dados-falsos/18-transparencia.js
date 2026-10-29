export const COMPOSICAO_TAXA = [
  { parte: 'Repasse ao projeto', percentual: 88, corVar: '--cor-marca' },
  { parte: 'Intermediação de pagamento', percentual: 7, corVar: '--cor-institucional' },
  { parte: 'Manutenção da plataforma', percentual: 5, corVar: '--cor-urgencia' },
];

export const TABELA_MEIOS_PAGAMENTO = [
  { meio: 'PIX', prazoRepasse: 'automático, ao fim da campanha', taxaAdicional: 'nenhuma' },
  { meio: 'Cartão de crédito', prazoRepasse: 'automático, ao fim da campanha', taxaAdicional: '+2,5% da operadora' },
  { meio: 'Boleto bancário', prazoRepasse: 'automático, ao fim da campanha, após a compensação', taxaAdicional: 'R$ 2,90 por boleto' },
];

export const O_QUE_NAO_FAZEMOS = [
  'Não cobramos do apoiador nenhuma taxa além do valor da contribuição.',
  'Não retemos valores de campanhas que atingiram a meta: o repasse é automático no encerramento.',
  'Não compartilhamos dados de pagamento com o pesquisador, só o valor total arrecadado.',
  'Não permitimos edição do orçamento depois que a campanha entra em captação.',
];

export const POLITICA_ESTORNO = 'No modelo Tudo ou Nada, se a meta não for atingida até o prazo final, toda contribuição é devolvida automaticamente pelo mesmo meio de pagamento, sem necessidade de solicitação. No modelo Flexível não há estorno: o valor arrecadado é repassado ao projeto mesmo que a meta não seja atingida.';

export const TAXA_REPASSE_PADRAO_PERCENTUAL = 88;
