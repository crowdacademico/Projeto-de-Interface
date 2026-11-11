// Selos de status da campanha e de modelo de financiamento, em JavaScript puro.
// Baseado em selo-status-campanha, selo-modelo-financiamento e status.constants da Alexia (branch main).
import { escaparHtml } from './1-utilitarios.js';

export const STATUS_CAMPANHA = {
  'em-captacao': { rotulo: 'Em captação', icone: 'fa-hand-holding-dollar', classe: 'fundo-aviso texto-aviso' },
  financiada: { rotulo: 'Financiada', icone: 'fa-circle-check', classe: 'badge-sucesso' },
  'nao-financiada': { rotulo: 'Não financiada', icone: 'fa-circle-info', classe: 'badge-neutro' },
  'em-breve': { rotulo: 'Em breve', icone: 'fa-clock', classe: 'fundo-institucional-sutil texto-institucional' },
};

export function htmlSeloStatusCampanha(status, descricao) {
  const estado = STATUS_CAMPANHA[status];
  if (!estado) return '';
  return `<span class="badge ${estado.classe}" aria-label="Status da campanha: ${estado.rotulo}"><i class="fa-solid ${estado.icone} mr-1" aria-hidden="true"></i>${escaparHtml(descricao ?? estado.rotulo)}</span>`;
}

export function htmlSeloModeloFinanciamento(modelo, classe = '') {
  const flexivel = modelo === 'flexivel';
  const tom = flexivel ? 'texto-info borda-info' : 'texto-aviso borda-aviso';
  return `<span class="badge-flutuante microrrotulo border-2 ${classe || tom}">${flexivel ? 'Flexível' : 'Tudo ou Nada'}</span>`;
}
