import type { MouseEvent } from 'react';

export interface CampanhaCardData {
  id?: number;
  image: string;
  badge: string;
  badgeClasses: string;
  status?: string;
  title: string;
  description: string;
  avatar: string;
  avatarClasses: string;
  researcher: string;
  institution: string;
  uf: string;
  category: string;
  value: string;
  progressLabel: string;
  supportLabel: string;
  timeLabel: string;
  valorArrecadado: number;
  meta: number;
  modelo: 'flexivel' | 'tudo-ou-nada';
  diasParaInicio?: number;
}

export interface OpcoesRenderizacaoCartoesCampanha {
  onAbrir: () => void;
  onAlternarSeguir: (evento: MouseEvent<HTMLButtonElement>, id: number) => void;
  mensagemVazia?: string;
}
