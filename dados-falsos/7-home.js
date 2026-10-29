export const homeProfiles = [
    {
        icon: 'fa-user-secret',
        title: 'Visitante Anônimo',
        heading: 'Explore projetos sem barreira nenhuma',
        destaque: 'sem barreira nenhuma',
        beneficios: [
            'Navegar por campanhas publicadas sem precisar criar conta',
            'Ver orçamento, meta, prazo e o pesquisador responsável de cada projeto',
            'Apoiar via PIX sem se identificar',
            'Nenhum dado pessoal é solicitado ou armazenado',
        ],
    },
    {
        icon: 'fa-heart',
        title: 'Apoiador Cadastrado',
        heading: 'Apoie com transparência total',
        destaque: 'transparência total',
        beneficios: [
            'Consultar o histórico completo de contribuições, com status de cada uma',
            'Seguir campanhas de interesse e receber atualizações',
            'Pagar com PIX, cartão de crédito, débito ou boleto',
            'Denunciar campanhas ou perfis que pareçam suspeitos',
        ],
    },
    {
        icon: 'fa-flask',
        title: 'Pesquisador',
        heading: 'Gerencie campanhas com controle real',
        destaque: 'controle real',
        beneficios: [
            'Submeter projetos com orçamento e cronograma detalhados',
            'Oferecer recompensas simbólicas aos apoiadores',
            'Acompanhar a arrecadação em tempo real',
            'Publicar atualizações de progresso do projeto',
        ],
    },
    {
        icon: 'fa-shield-halved',
        title: 'Administrador',
        heading: 'Controle a plataforma com segurança',
        destaque: 'com segurança',
        beneficios: [
            'Avaliar e aprovar ou rejeitar campanhas submetidas',
            'Averiguar denúncias contra campanhas e perfis',
            'Suspender contas ou encerrar campanhas irregulares',
            'Visibilidade do estado geral da plataforma por métricas consolidadas',
        ],
    },
];

export const homeStats = [
    { value: 'R$ 2.4M', valueClass: 'texto-sobre-escuro-forte', label: 'Levantados para a ciência' },
    { value: '143', valueClass: 'texto-marca-sobre-escuro', label: 'Projetos financiados' },
    { value: '18.5k', valueClass: 'texto-sobre-escuro-forte', label: 'Apoiadores ativos' }
];

export const HOME_CONFIANCA = [
    { icone: 'fa-solid fa-shield-halved', titulo: 'Curadoria antes de publicar', texto: 'Toda campanha é analisada antes de ir ao ar: meta, orçamento por categoria e cronograma.' },
    { icone: 'fa-solid fa-lock', titulo: 'Cada real com destino', texto: 'Depois da aprovação, meta e orçamento ficam congelados. O pesquisador presta contas com atualizações de progresso.' },
    { icone: 'fa-brands fa-pix', titulo: 'PIX, com ou sem cadastro', texto: 'Qualquer pessoa apoia via PIX, sem criar conta e sem informar dados pessoais.' },
    { icone: 'fa-regular fa-star', titulo: 'Reputação do pesquisador', texto: 'Cada pesquisador tem uma pontuação pública, calculada pelo perfil, pelo histórico de campanhas e pelas atualizações.' },
];

export const HOME_PASSOS_APOIO = [
    { titulo: 'Escolha um projeto', texto: 'Explore as pesquisas em captação e encontre uma causa que faça sentido para você.' },
    { titulo: 'Faça sua contribuição', texto: 'Apoie via PIX em poucos segundos, com ou sem cadastro.' },
    { titulo: 'Acompanhe o progresso', texto: 'Veja a evolução da campanha e as atualizações publicadas pelo pesquisador.' },
];

export const HOME_PERGUNTAS = [
    { pergunta: 'Quanto a plataforma cobra?', resposta: (taxa) => `Uma taxa de ${taxa}% sobre o valor arrecadado, descontada no repasse ao pesquisador. Quem apoia não paga nada a mais, e o pesquisador vê a taxa antes de enviar a campanha.` },
    { pergunta: 'Como o dinheiro chega ao pesquisador?', resposta: () => 'Você paga via PIX e o pagamento é processado por um intermediador de pagamento. O repasse ao pesquisador é automático, já com a taxa da plataforma descontada, e cada etapa fica registrada.' },
    { pergunta: 'O que acontece se a meta não for atingida?', resposta: () => 'Depende do modelo. No Tudo ou Nada, o pesquisador só recebe se a meta for atingida no prazo; se não for, o dinheiro volta para quem apoiou. No Flexível, o valor é repassado mesmo sem atingir a meta, e isso aparece em destaque antes de você confirmar.' },
    { pergunta: 'Preciso ter vínculo com uma universidade?', resposta: () => 'Não. O pesquisador pode se declarar independente, como autônomos, aposentados ou quem saiu de um programa. O vínculo, o título e os links acadêmicos aparecem no perfil público.' },
    { pergunta: 'Posso apoiar sem criar conta?', resposta: () => 'Sim, via PIX. A contribuição aparece como anônima e nenhum dado de identificação é pedido. Sem conta, porém, você não recebe notificações sobre a campanha.' },
    { pergunta: 'Quem avalia a minha campanha?', resposta: () => 'A curadoria da plataforma, antes da publicação. Se a campanha for rejeitada, você recebe o motivo e pode corrigir e reenviar.' },
];
