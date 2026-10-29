import { TAXA_PLATAFORMA_PERCENTUAL } from './12-config-prototipo.js';

export const PASSOS_APOIAR = [
  { numero: 1, titulo: 'Escolha um projeto', texto: 'Explore campanhas por área do conhecimento, instituição ou status de captação. Cada projeto mostra orçamento, metodologia e o vínculo institucional do pesquisador.' },
  { numero: 2, titulo: 'Apoie via PIX', texto: 'Contribua a partir de R$ 5. Apoiadores anônimos usam PIX; usuários cadastrados também têm cartão e boleto.' },
  { numero: 3, titulo: 'Acompanhe o andamento', texto: 'Receba atualizações do pesquisador conforme o projeto avança, marcos financeiros e resultados científicos na mesma linha do tempo.' },
  { numero: 4, titulo: 'Veja o resultado', texto: 'Se a meta for atingida, o valor é repassado ao projeto. Se não for (modelo Tudo ou Nada), sua contribuição é estornada automaticamente.' },
];

export const TABELA_MODELOS_FINANCIAMENTO = [
  { criterio: 'Se a meta é atingida', tudoOuNada: 'Valor repassado ao pesquisador', flexivel: 'Valor repassado ao pesquisador' },
  { criterio: 'Se a meta NÃO é atingida', tudoOuNada: 'Contribuições estornadas automaticamente', flexivel: 'Valor arrecadado permanece com o projeto' },
  { criterio: 'Quando a cobrança acontece', tudoOuNada: 'No momento da contribuição, com devolução se a meta não for atingida', flexivel: 'No momento da contribuição' },
  { criterio: 'Indicado para', tudoOuNada: 'Projetos com custo mínimo fixo (equipamento, insumo específico)', flexivel: 'Projetos que avançam com qualquer valor arrecadado' },
  { criterio: 'Meios de pagamento aceitos', tudoOuNada: 'Só PIX (apoiador anônimo)', flexivel: 'PIX, cartão e boleto (usuário cadastrado)' },
];

export const REQUISITOS_PESQUISADOR = [
  { icone: 'fa-id-card', titulo: 'Perfil acadêmico completo', texto: 'CPF, título acadêmico, vínculo institucional ou independente e links acadêmicos (Lattes, ORCID e outros), exibidos no perfil público.' },
  { icone: 'fa-diagram-project', titulo: 'Área do conhecimento cadastrada', texto: 'O projeto precisa se encaixar em uma área ativa do catálogo CNPq mantido pela curadoria.' },
  { icone: 'fa-magnifying-glass-chart', titulo: 'Escopo e orçamento detalhados', texto: 'Metodologia, resultados esperados e itens de orçamento justificados, é o que a curadoria avalia antes de aprovar.' },
  { icone: 'fa-clock', titulo: 'Prazo de captação entre 15 e 60 dias', texto: 'Definido pelo pesquisador dentro dessa janela no momento da submissão.' },
  { icone: 'fa-layer-group', titulo: 'Até 2 campanhas simultâneas', texto: 'Em andamento ou aguardando aprovação, por pesquisador. Evita dispersão de esforço de captação.' },
];

export const PASSOS_INSTITUICAO = [
  { titulo: 'Vínculo declarado', texto: 'O pesquisador declara o vínculo com a instituição, que aparece no perfil público junto com os links acadêmicos. A instituição não precisa aprovar manualmente cada campanha.' },
  { titulo: 'Acompanhamento agregado', texto: 'Institucionais podem solicitar um relatório periódico de campanhas ativas e captação total vinculada ao seu quadro de pesquisadores.' },
  { titulo: 'Repasse direto', texto: 'O valor líquido é repassado automaticamente ao pesquisador pelo intermediador de pagamento. A plataforma não intermedia contratos institucionais.' },
];

export const PERGUNTAS_FREQUENTES = [
  { categoria: 'Apoiar', pergunta: 'Existe valor mínimo de contribuição?', resposta: 'Sim, R$ 5,00 por contribuição, em qualquer modelo de financiamento.' },
  { categoria: 'Apoiar', pergunta: 'Preciso me cadastrar para apoiar um projeto?', resposta: 'Não, apoiadores anônimos podem contribuir via PIX sem cadastro. Cartão de crédito, débito e boleto exigem conta cadastrada.' },
  { categoria: 'Apoiar', pergunta: 'O que acontece se o projeto não atingir a meta?', resposta: 'Depende do modelo: no Tudo ou Nada, o valor é devolvido automaticamente a quem apoiou. No Flexível, o valor arrecadado é repassado ao pesquisador mesmo assim.' },
  { categoria: 'Apoiar', pergunta: 'Como sei que o pesquisador é real?', resposta: 'Todo pesquisador informa o CPF e tem um perfil público com vínculo, título e links acadêmicos, como Lattes e ORCID. Além disso, toda campanha passa pela curadoria antes de ser publicada.' },
  { categoria: 'Pesquisador', pergunta: 'Quanto tempo leva a curadoria?', resposta: 'A análise acontece antes da publicação e avalia escopo, metodologia e orçamento. Se a campanha for rejeitada, você recebe o motivo e pode corrigir e reenviar.' },
  { categoria: 'Pesquisador', pergunta: 'Posso editar a campanha depois de publicada?', resposta: 'Dados de captação (meta, prazo) ficam fixos após publicação para preservar a confiança de quem já apoiou; atualizações de conteúdo podem ser postadas a qualquer momento.' },
  { categoria: 'Pesquisador', pergunta: 'Existe taxa da plataforma?', resposta: `Sim, uma taxa de ${TAXA_PLATAFORMA_PERCENTUAL}% sobre o valor arrecadado, descontada no repasse ao pesquisador. Quem apoia não paga nada a mais, e o pesquisador vê a taxa antes de enviar a campanha.` },
  { categoria: 'Pesquisador', pergunta: 'Posso encerrar a campanha antes do prazo?', resposta: 'Sim, com justificativa. Pedidos de encerramento antecipado passam por uma análise da moderação antes de serem efetivados.' },
  { categoria: 'Geral', pergunta: 'Meus dados de pagamento ficam salvos na plataforma?', resposta: 'Não, o processamento de pagamento é feito por um intermediador externo; a plataforma nunca armazena dados de cartão.' },
  { categoria: 'Geral', pergunta: 'Como faço uma denúncia sobre um projeto?', resposta: 'Todo projeto tem um botão "Relatar um problema" na página de detalhe, que abre uma análise da moderação.' },
];

export const APROVACOES_PENDENTES_FALSAS = [
  { submissao: 'Hoje, 14:30', projeto: 'Testes de VRM em Placas B450', pesquisador: 'Lucas Novais (IFSP)', modelo: 'Tudo ou Nada', classeModelo: 'fundo-aviso texto-aviso', valor: 'R$ 15.000' },
  { submissao: 'Ontem, 09:15', projeto: 'Sensor de Qualidade da Água em Rios Urbanos', pesquisador: 'Dra. Camila Rodrigues (Unicamp)', modelo: 'Flexível', classeModelo: 'fundo-info texto-info', valor: 'R$ 22.500' },
];

