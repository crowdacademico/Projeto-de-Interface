import { useState } from 'react';
import type { TipoToast } from '../components/layout/toast.constants';

export function useGuiaEstilos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagemToast, setMensagemToast] = useState<string | null>(null);
  const [tipoToast, setTipoToast] = useState<TipoToast>('sucesso');
  const [areasSelecionadas, setAreasSelecionadas] = useState<string[]>(['computacao']);
  const [seguindo, setSeguindo] = useState(false);
  const [resultadosVisiveis, setResultadosVisiveis] = useState(3);

  function mostrarToast(tipo: TipoToast, mensagem: string) {
    setTipoToast(tipo);
    setMensagemToast(mensagem);
  }

  return {
    modalAberto,
    setModalAberto,
    mensagemToast,
    setMensagemToast,
    tipoToast,
    areasSelecionadas,
    setAreasSelecionadas,
    seguindo,
    setSeguindo,
    resultadosVisiveis,
    mostrarMaisResultados: () => setResultadosVisiveis((atual) => Math.min(atual + 3, 8)),
    mostrarToast,
  };
}
