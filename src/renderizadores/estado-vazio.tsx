import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { EstadoVazio } from '../components/crud/estado-vazio';
import type { ReactNode } from 'react';

interface OpcoesEstadoVazio {
  titulo: string;
  texto?: ReactNode;
  icone?: string;
  acao?: ReactNode;
}

const raizes = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();

export function renderizarEstadoVazio(container: HTMLElement, opcoes: OpcoesEstadoVazio) {
  let raiz = raizes.get(container);
  if (!raiz) {
    raiz = createRoot(container);
    raizes.set(container, raiz);
  }
  flushSync(() => raiz.render(createElement(EstadoVazio, opcoes)));
}
