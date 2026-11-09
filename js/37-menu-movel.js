export function abrirMenuMovel() {
  window.dispatchEvent(new Event('menu-movel:abrir'));
}

export function fecharMenuMovel() {
  window.dispatchEvent(new Event('menu-movel:fechar'));
}
