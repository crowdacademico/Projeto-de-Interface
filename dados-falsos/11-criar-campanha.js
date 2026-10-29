export const createAreaOptions = [
    { value: 'biologicas', label: 'Ciências Biológicas' },
    { value: 'exatas', label: 'Ciências Exatas e da Terra' },
    { value: 'saude', label: 'Ciências da Saúde' }
];

export const createModelOptions = [
    { value: 'all-or-nothing', icone: 'fa-shield-halved', title: 'Tudo ou Nada', description: 'Apoio só é cobrado se a meta for atingida.', consequencia: 'Se não bater a meta, o valor é devolvido. Risco zero pra quem apoia.', checked: true },
    { value: 'flex', icone: 'fa-chart-line', title: 'Flexível', description: 'O valor arrecadado permanece com o projeto mesmo sem meta completa.', consequencia: 'Mesmo sem bater 100%, você fica com o que foi arrecadado. Mais previsível, menos "tudo ou nada".', checked: false }
];

export const PASSOS_CRIAR_CAMPANHA = [
    { chave: 'identificacao', numero: 1, rotulo: 'Identificação' },
    { chave: 'projeto', numero: 2, rotulo: 'O projeto' },
    { chave: 'orcamento', numero: 3, rotulo: 'Orçamento e meta' },
    { chave: 'revisao', numero: 4, rotulo: 'Revisão' },
];

export const CAPAS_CRIAR_CAMPANHA = [
    { id: 'biologicas', src: 'imagens/projeto-biologicas.jpg', alt: 'Foto de laboratório de biologia' },
    { id: 'computacao', src: 'imagens/projeto-computacao.jpg', alt: 'Foto de equipamento de computação' },
    { id: 'saude', src: 'imagens/projeto-saude.jpg', alt: 'Foto de laboratório de saúde' },
];
