import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Toast } from '../src/components/layout/toast';
import { DURACAO_TOAST_MS, MAXIMO_TOASTS } from '../src/components/layout/toast.constants';
let proximoAvisoId = 0;
const avisosAtivos = new Set();

function containerAvisos() {
  return document.getElementById('app-avisos');
}

export function mostrarAviso(mensagem, tipo = 'info') {
  const container = containerAvisos();
  if (!container) {
    throw new Error('Contêiner de avisos não encontrado.');
  }

  while (avisosAtivos.size >= MAXIMO_TOASTS) {
    removerAviso(avisosAtivos.values().next().value, true);
  }

  const elemento = document.createElement('div');
  container.appendChild(elemento);
  const registro = { elemento, raiz: createRoot(elemento), removendo: false };
  const idBotaoFechar = `aviso-fechar-${proximoAvisoId++}`;
  registro.raiz.render(createElement(Toast, {
    mensagem,
    tipo,
    idBotaoFechar,
    aoFechar: () => removerAviso(registro),
  }));
  avisosAtivos.add(registro);
  setTimeout(() => removerAviso(registro), DURACAO_TOAST_MS);
}

function removerAviso(registro, imediatamente = false) {
  if (!registro || registro.removendo) return;
  registro.removendo = true;
  if (!registro.elemento.isConnected || imediatamente) {
    registro.raiz.unmount();
    registro.elemento.remove();
    avisosAtivos.delete(registro);
    return;
  }
  const aviso = registro.elemento.querySelector('.aviso');
  if (!aviso) throw new Error('Toast não foi montado no contêiner de avisos.');
  const duracao = getComputedStyle(aviso).animationDuration.split(',')[0].trim();
  const valorDuracao = Number.parseFloat(duracao);
  const duracaoMs = duracao.endsWith('ms') ? valorDuracao : valorDuracao * 1000;
  aviso.classList.add('aviso--saindo');
  let finalizado = false;
  const finalizar = () => {
    if (finalizado) return;
    finalizado = true;
    registro.raiz.unmount();
    registro.elemento.remove();
    avisosAtivos.delete(registro);
  };
  if (!duracaoMs) {
    finalizar();
    return;
  }
  registro.elemento.addEventListener('animationend', finalizar, { once: true });
  setTimeout(finalizar, duracaoMs);
}
