import type { OpcaoFiltro } from '../types/areas-conhecimento';
import type { CampanhaCardData } from '../types/cartao-campanha';

export const OPCOES_FILTRO_DEMONSTRACAO: OpcaoFiltro[] = [
  { value: 'computacao', label: 'Ciência da Computação', count: 12 },
  { value: 'biologia', label: 'Ciências Biológicas', count: 8 },
  { value: 'saude', label: 'Ciências da Saúde', count: 6 },
];

export const CAMPANHA_DEMONSTRACAO: CampanhaCardData = {
  id: 1,
  image: '/imagens/projeto-computacao.jpg',
  badge: 'Em captação',
  badgeClasses: 'fundo-aviso texto-aviso',
  status: 'em-captacao',
  title: 'Tecnologia aberta para a ciência brasileira',
  description: 'Um projeto demonstrativo para visualizar o cartão de campanha.',
  avatar: 'LM',
  avatarClasses: 'fundo-marca-sutil texto-marca borda-marca',
  researcher: 'Laura Martins',
  institution: 'Instituto de Pesquisa',
  uf: 'SP',
  category: 'Ciência da Computação',
  value: 'R$ 8.400',
  progressLabel: '42%',
  supportLabel: '36 apoiadores',
  timeLabel: '18 dias restantes',
  valorArrecadado: 8400,
  meta: 20000,
  modelo: 'flexivel',
};
