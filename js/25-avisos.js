const ICONES = {
  info: 'fa-circle-info',
  sucesso: 'fa-circle-check',
  aviso: 'fa-triangle-exclamation',
  erro: 'fa-circle-xmark',
};

const DURACAO_VISIVEL_MS = 4200;
const MAXIMO_EMPILHADO = 3;

function containerAvisos() {
  return document.getElementById('app-avisos');
}

export function mostrarAviso(mensagem, tipo = 'info') {
  const container = containerAvisos();
  if (!container) {

    return;
  }

  while (container.children.length >= MAXIMO_EMPILHADO) {
    container.removeChild(container.firstElementChild);
  }

  const icone = ICONES[tipo] || ICONES.info;
  const elemento = document.createElement('div');
  elemento.className = `aviso aviso--${tipo}`;

  const spanIcone = document.createElement('i');
  spanIcone.className = `fa-solid ${icone} aviso__icone`;

  const divTexto = document.createElement('div');
  divTexto.className = 'aviso__texto';
  divTexto.textContent = mensagem;

  const botaoFechar = document.createElement('button');
  botaoFechar.type = 'button';
  botaoFechar.className = 'aviso__fechar';
  botaoFechar.setAttribute('aria-label', 'Fechar aviso');
  botaoFechar.textContent = '×';

  elemento.append(spanIcone, divTexto, botaoFechar);

  const remover = () => {
    if (!elemento.isConnected) return;
    elemento.classList.add('aviso--saindo');
    elemento.addEventListener('animationend', () => elemento.remove(), { once: true });
  };

  botaoFechar.addEventListener('click', remover);
  container.appendChild(elemento);
  setTimeout(remover, DURACAO_VISIVEL_MS);
}
