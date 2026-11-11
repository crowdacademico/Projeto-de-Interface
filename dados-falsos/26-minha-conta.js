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
    capaUrl: 'imagens/projeto-computacao.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=exemplo',
    dataInicio: '2026-02-01',
    dataFim: '2026-10-30',
    modalidade: 'all-or-nothing',
    recompensas: [
      { id: 'rec-ia-1', titulo: 'Agradecimento público', descricao: 'Nome nos agradecimentos do relatório.', tipo: 'reconhecimento', valorMinimo: '25.00', quantidadeDisponivel: null, escolhidas: 4, ativo: true, url: '', tipoLink: '' },
      { id: 'rec-ia-2', titulo: 'Relatório de resultados', descricao: 'Acesso digital ao relatório da pesquisa.', tipo: 'digital', valorMinimo: '80.00', quantidadeDisponivel: 30, escolhidas: 2, ativo: true, url: 'https://github.com/crowdacademico/relatorio-ia', tipoLink: 'GitHub' },
    ],
    atualizacoes: [
      { id: 'atu-ia-1', titulo: 'Primeiro protótipo em testes', mensagem: 'A equipe iniciou os testes do primeiro protótipo com estudantes parceiros.', data: '2026-02-28', fase: 'andamento', tipo: 'texto', ativo: true },
    ],
    comentarios: [
      { id: 'com-ia-1', autor: 'João Martins', texto: 'A proposta pode ajudar muitos estudantes da rede pública.', criadoEm: '2026-08-03', endossado: false, ativo: true },
      { id: 'com-ia-2', autor: 'Ana Ribeiro', texto: 'Parabéns pela parceria com as escolas.', criadoEm: '2026-08-01', endossado: true, ordemEndosso: 1, ativo: true },
    ],
    contribuicoes: [
      { id: 'apoio-ia-1', criadoEm: '2026-08-17', apoiador: 'Rafael Lima', valor: '80.00', status: 'confirmado', pagamento: 'pix', recompensaId: 'rec-ia-2' },
      { id: 'apoio-ia-2', criadoEm: '2026-08-14', apoiador: 'Apoiador anônimo', valor: '25.00', status: 'pendente', pagamento: 'boleto', recompensaId: 'rec-ia-1' },
    ],
  },
  {
    id: 'campanha-biomarcadores',
    titulo: 'Biomarcadores de Dengue',
    resumo: 'Investigação de marcadores para apoiar o diagnóstico precoce.',
    meta: '15000',
    estado: 'Finalizada',
    arrecadado: 'R$ 15.000,00',
    capaUrl: 'imagens/projeto-saude.jpg',
    videoUrl: '',
    dataInicio: '2026-03-01',
    dataFim: '2026-08-01',
    modalidade: 'flexivel',
    recompensas: [
      { id: 'rec-bio-1', titulo: 'Agradecimento público', descricao: 'Nome nos agradecimentos do artigo.', tipo: 'reconhecimento', valorMinimo: '30.00', quantidadeDisponivel: null, escolhidas: 8, ativo: true, url: '', tipoLink: '' },
    ],
    atualizacoes: [
      { id: 'atu-bio-1', titulo: 'Relatório final publicado', mensagem: 'Os resultados finais foram publicados para a comunidade.', data: '2026-08-10', fase: 'resultado_final', tipo: 'pdf', anexos: [{ nome: 'relatorio-final.pdf', mime: 'application/pdf' }], ativo: true },
    ],
    comentarios: [],
    contribuicoes: [
      { id: 'apoio-bio-1', criadoEm: '2026-07-26', apoiador: 'Mariana Costa', valor: '150.00', status: 'repassado', pagamento: 'cartao_credito', recompensaId: 'rec-bio-1' },
    ],
  },
  {
    id: 'campanha-rascunho',
    titulo: 'Novo projeto de pesquisa',
    resumo: 'Rascunho ainda não enviado para curadoria.',
    meta: '5000',
    estado: 'Rascunho',
    arrecadado: 'R$ 0,00',
    capaUrl: 'imagens/projeto-biologicas.jpg',
    videoUrl: '',
    dataInicio: '',
    dataFim: '',
    modalidade: 'all-or-nothing',
    recompensas: [],
    atualizacoes: [],
    comentarios: [],
    contribuicoes: [],
  },
];

export const COMENTARIOS_PESQUISADOR_INICIAIS = [
  { campanha: 'Microplásticos no Rio Paraná', texto: 'Como será feita a coleta das amostras?', estado: 'Aguardando endosso do pesquisador' },
  { campanha: 'Bolsas para iniciação científica', texto: 'A iniciativa pode ampliar o acesso à pesquisa.', estado: 'Endossado e público' },
];
