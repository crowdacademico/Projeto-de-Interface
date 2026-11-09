// A paginação incremental anuncia o progresso e fornece um alvo claro para continuar.
interface MaisResultadosProps {
  mostrando: number;
  total: number;
  idBotao: string;
  aoClicar: () => void;
  rotulo?: string;
}

export function MaisResultados({
  mostrando,
  total,
  idBotao,
  aoClicar,
  rotulo = 'Mostrar mais',
}: MaisResultadosProps) {
  return (
    <div className="text-center" aria-live="polite">
      <p className="texto-fraco text-sm mb-3">
        Mostrando {mostrando} de {total}
      </p>
      <button type="button" id={idBotao} className="btn btn-secondary" onClick={aoClicar}>
        {rotulo}
      </button>
    </div>
  );
}
