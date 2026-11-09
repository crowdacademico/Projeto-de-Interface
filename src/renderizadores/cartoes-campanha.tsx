import { Fragment } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { CartaoCampanha } from '../components/crud/cartao-campanha';
import type {
  CampanhaCardData,
  OpcoesRenderizacaoCartoesCampanha,
} from '../types/cartao-campanha';

declare global {
  interface Window {
    __crowdAcademicoRaizesCardsCampanha?: WeakMap<HTMLElement, Root>;
    __crowdAcademicoCampanhasSeguidas?: Set<number>;
  }
}

const raizes =
  window.__crowdAcademicoRaizesCardsCampanha ??
  (window.__crowdAcademicoRaizesCardsCampanha = new WeakMap<HTMLElement, Root>());
const campanhasSeguidas =
  window.__crowdAcademicoCampanhasSeguidas ??
  (window.__crowdAcademicoCampanhasSeguidas = new Set<number>());

export function renderizarCardsCampanha(
  container: HTMLElement | null,
  campanhas: CampanhaCardData[],
  { onAbrir, onAlternarSeguir, mensagemVazia }: OpcoesRenderizacaoCartoesCampanha,
) {
  if (!container) return;

  let raiz = raizes.get(container);
  if (!raiz) {
    raiz = createRoot(container);
    raizes.set(container, raiz);
  }

  raiz.render(
    <Fragment>
      {campanhas.length > 0
        ? campanhas.map((campanha, indice) => {
            const id = campanha.id ?? -1;
            return (
              <CartaoCampanha
                key={`${id}-${indice}`}
                campanha={campanha}
                seguindo={campanhasSeguidas.has(id)}
                onAbrir={onAbrir}
                onAlternarSeguir={(evento, campanhaId) => {
                  campanhasSeguidas.has(campanhaId)
                    ? campanhasSeguidas.delete(campanhaId)
                    : campanhasSeguidas.add(campanhaId);
                  onAlternarSeguir(evento, campanhaId);
                }}
              />
            );
          })
        : mensagemVazia && <p className="texto-fraco text-sm">{mensagemVazia}</p>}
    </Fragment>,
  );
}
