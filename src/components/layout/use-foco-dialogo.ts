// O hook mantém o foco dentro de um diálogo e o devolve ao fechar.
import { useEffect, type RefObject } from 'react';

export function useFocoDialogo(
  referencia: RefObject<HTMLElement | null>,
  aberto: boolean,
  aoFechar: () => void,
) {
  useEffect(() => {
    if (!aberto) return;

    const focoAnterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialogo = referencia.current;
    const focaveis = () =>
      Array.from(
        dialogo?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((item) => item.getClientRects().length > 0);

    dialogo?.focus();
    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        aoFechar();
        return;
      }
      if (evento.key !== 'Tab') return;

      const itens = focaveis();
      if (!itens?.length) {
        evento.preventDefault();
        dialogo?.focus();
        return;
      }

      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];
      const focoEstaNosControles = document.activeElement instanceof HTMLElement
        && itens.includes(document.activeElement);
      if (evento.shiftKey && (document.activeElement === primeiro || !focoEstaNosControles)) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && (document.activeElement === ultimo || !focoEstaNosControles)) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener('keydown', aoPressionarTecla);
    return () => {
      document.removeEventListener('keydown', aoPressionarTecla);
      focoAnterior?.focus();
    };
  }, [aberto, aoFechar, referencia]);
}
