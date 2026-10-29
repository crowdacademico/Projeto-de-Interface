import { buscarUsuarioPorId } from '../dados-falsos/1-usuarios.js';

const CHAVE_SESSAO_FALSA = 'crowdacademico-protótipo.sessao';

export function usuarioAtual() {
  const valor = localStorage.getItem(CHAVE_SESSAO_FALSA);
  return valor ? buscarUsuarioPorId(Number(valor)) : null;
}

export function estaAutenticado() {
  return usuarioAtual() !== null;
}

export function temPapel(papel) {
  return (usuarioAtual()?.papeis ?? []).includes(papel);
}

export function entrarComo(idUsuario) {
  localStorage.setItem(CHAVE_SESSAO_FALSA, String(idUsuario));
}

export function sair() {
  localStorage.removeItem(CHAVE_SESSAO_FALSA);
}
