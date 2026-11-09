import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { FiltrosConhecimento } from '../components/search/filtros-conhecimento';

interface FiltrosConhecimentoOptions {
  grandesAreasSelecionadas: string[];
  subareasSelecionadas: string[];
  aoAlterarGrandesAreas: (values: string[]) => void;
  aoAlterarSubareas: (values: string[]) => void;
}

const raizes = new WeakMap<HTMLElement, Root>();

export function renderizarFiltrosConhecimento(
  container: HTMLElement | null,
  props: FiltrosConhecimentoOptions,
) {
  if (!container) return;

  let raiz = raizes.get(container);
  if (!raiz) {
    raiz = createRoot(container);
    raizes.set(container, raiz);
  }
  raiz.render(createElement(FiltrosConhecimento, props));
}
