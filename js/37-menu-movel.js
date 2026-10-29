function onTeclaEsc(evento) {
  if (evento.key === 'Escape') fecharMenuMovel();
}

export function abrirMenuMovel() {
  const gaveta = document.getElementById('menu-movel-gaveta');
  const veu = document.getElementById('menu-movel-veu');
  const botao = document.getElementById('botao-menu-movel');
  if (!gaveta || !veu) return;

  gaveta.classList.remove('translate-x-full');
  veu.classList.remove('opacity-0', 'pointer-events-none');
  botao?.setAttribute('aria-expanded', 'true');
  document.addEventListener('keydown', onTeclaEsc);
  gaveta.querySelector('a')?.focus();
}

export function fecharMenuMovel() {
  const gaveta = document.getElementById('menu-movel-gaveta');
  const veu = document.getElementById('menu-movel-veu');
  const botao = document.getElementById('botao-menu-movel');
  if (!gaveta || !veu) return;

  gaveta.classList.add('translate-x-full');
  veu.classList.add('opacity-0', 'pointer-events-none');
  botao?.setAttribute('aria-expanded', 'false');
  document.removeEventListener('keydown', onTeclaEsc);
  botao?.focus();
}
