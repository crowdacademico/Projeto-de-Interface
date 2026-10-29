export const CHAVE_TEMA = 'crowdacademico-protótipo.tema';

export function lerTemaSalvo() {
  const salvo = localStorage.getItem(CHAVE_TEMA);
  return salvo === 'claro' || salvo === 'escuro' || salvo === 'sistema' ? salvo : 'sistema';
}

export function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  localStorage.setItem(CHAVE_TEMA, tema);
}

export function temaEfetivoEscuro() {
  const tema = lerTemaSalvo();
  if (tema === 'escuro') return true;
  if (tema === 'claro') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function alternarTema() {
  aplicarTema(temaEfetivoEscuro() ? 'claro' : 'escuro');
  atualizarIconeTema();
}

export function atualizarIconeTema() {
  const botao = document.getElementById('botao-tema');
  if (!botao) return;
  const escuro = temaEfetivoEscuro();
  botao.innerHTML = `<i class="fa-solid ${escuro ? 'fa-sun' : 'fa-moon'}"></i>`;
  botao.setAttribute('aria-label', escuro ? 'Tema claro' : 'Tema escuro');
  botao.title = escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro';
}
