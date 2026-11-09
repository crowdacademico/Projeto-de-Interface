export const ATIVIDADE_CONTA_INICIAL = {
  campanhasSeguidas: [
    { titulo: 'Microplásticos no Rio Paraná', estado: 'Em captação', rota: 'campanha' },
    { titulo: 'IA Híbrida para STI', estado: 'Atualização recente', rota: 'campanha' },
  ],
  pesquisadoresSeguidos: [
    { nome: 'Dra. Marina Souza', instituicao: 'UNESP Ilha Solteira' },
  ],
  denuncias: [
    { alvo: 'Campanha: Biomarcadores de Dengue', motivo: 'Informação desatualizada', estado: 'Em análise' },
    { alvo: 'Pesquisador: perfil público', motivo: 'Dados suspeitos', estado: 'Em análise' },
  ],
  contribuicoes: [
    { campanha: 'Microplásticos no Rio Paraná', valor: 'R$ 150,00', data: '12/06/2026', pagamento: 'PIX', estado: 'Confirmada', recompensa: 'Relatório digital da pesquisa' },
    { campanha: 'IA Híbrida para STI', valor: 'R$ 80,00', data: '05/06/2026', pagamento: 'Cartão', estado: 'Processando', recompensa: 'Agradecimento público' },
  ],
};

export const CAMPANHAS_PESQUISADORAS_INICIAIS = [
  {
    id: 'campanha-ia',
    titulo: 'IA Híbrida para STI',
    resumo: 'Desenvolvimento de ferramentas de aprendizagem adaptativa para apoiar estudantes.',
    meta: '10000',
    estado: 'Em captação',
    arrecadado: 'R$ 4.500,00',
    recompensas: ['Agradecimento público', 'Relatório de resultados'],
    atualizacoes: [
      { titulo: 'Primeiro protótipo em testes', data: '28/02/2026' },
    ],
    comentarios: [
      { autor: 'João Martins', texto: 'A proposta pode ajudar muitos estudantes da rede pública.', endossado: false },
      { autor: 'Ana Ribeiro', texto: 'Parabéns pela parceria com as escolas.', endossado: true },
    ],
  },
  {
    id: 'campanha-biomarcadores',
    titulo: 'Biomarcadores de Dengue',
    resumo: 'Investigação de marcadores para apoiar o diagnóstico precoce.',
    meta: '15000',
    estado: 'Finalizada',
    arrecadado: 'R$ 15.000,00',
    recompensas: ['Agradecimento público'],
    atualizacoes: [
      { titulo: 'Relatório final publicado', data: '10/08/2026' },
    ],
    comentarios: [],
  },
  {
    id: 'campanha-rascunho',
    titulo: 'Novo projeto de pesquisa',
    resumo: 'Rascunho ainda não enviado para curadoria.',
    meta: '5000',
    estado: 'Rascunho',
    arrecadado: 'R$ 0,00',
    recompensas: [],
    atualizacoes: [],
    comentarios: [],
  },
];

export const COMENTARIOS_PESQUISADOR_INICIAIS = [
  { campanha: 'Microplásticos no Rio Paraná', texto: 'Como será feita a coleta das amostras?', estado: 'Aguardando endosso do pesquisador' },
  { campanha: 'Bolsas para iniciação científica', texto: 'A iniciativa pode ampliar o acesso à pesquisa.', estado: 'Endossado e público' },
];
