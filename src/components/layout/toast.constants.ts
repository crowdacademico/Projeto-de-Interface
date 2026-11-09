export const ICONES_TOAST = {
  info: 'fa-circle-info',
  sucesso: 'fa-circle-check',
  aviso: 'fa-triangle-exclamation',
  erro: 'fa-circle-xmark',
} as const;

export const DURACAO_TOAST_MS = 4200;
export const MAXIMO_TOASTS = 3;
export type TipoToast = keyof typeof ICONES_TOAST;
