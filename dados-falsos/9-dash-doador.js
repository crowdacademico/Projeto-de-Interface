export const donorMetrics = [
    { value: 'R$ 2.340', label: 'Total doado', accent: 'texto-forte' },
    { value: '7', label: 'Campanhas apoiadas', accent: 'text-primary' },
    { value: '98%', label: 'Contribuições confirmadas', accent: 'texto-sucesso' }
];

export const donorNovidades = [
    { projeto: 'Microplásticos no Rio Paraná', data: '05 mar 2026', titulo: 'Nova coleta realizada em março', corpo: 'Foram analisadas 24 amostras adicionais em área de maior pressão urbana.' },
    { projeto: 'IA Híbrida para STI', data: '28 fev 2026', titulo: 'Primeiro protótipo em testes', corpo: 'O modelo hiper-personalizado já está rodando com uma turma piloto de 30 alunos.' },
    { projeto: 'Microplásticos no Rio Paraná', data: '18 fev 2026', titulo: 'Marco: 25% da meta atingida', corpo: 'R$ 8.750 arrecadados, primeira leva de apoiadores institucionais.' },
];

export const donorFollowedCampaigns = [
    { title: 'Microplásticos no Rio Paraná', percentual: 65, valorAtual: 'R$ 22.750', valorMeta: 'R$ 35.000', modelo: 'tudo-ou-nada', meta: 'Em captação', accent: 'fundo-sucesso texto-sucesso' },
    { title: 'IA Híbrida para STI', percentual: 45, valorAtual: 'R$ 4.500', valorMeta: 'R$ 10.000', modelo: 'flexivel', meta: 'Atualização recente', accent: 'fundo-info texto-info' }
];

export const donorContributions = [
    { date: '12/06/2026', project: 'Microplásticos no Rio Paraná', value: 'R$ 150,00', payment: 'PIX', status: 'Confirmado', statusTone: 'sucesso' },
    { date: '05/06/2026', project: 'IA Híbrida para STI', value: 'R$ 80,00', payment: 'Cartão', status: 'Processando', statusTone: 'aviso' }
];

export const donorSidebarItems = [
    { rotulo: 'Meus Apoios', icone: 'fa-heart', ativo: true },
    { rotulo: 'Campanhas Seguidas', icone: 'fa-star', mensagem: 'Campanhas seguidas listadas no painel do usuário.' },
    { rotulo: 'Projetos Criados', icone: 'fa-lock', desabilitado: true }
];
