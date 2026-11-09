// O toast oferece confirmação breve, anúncio acessível e fechamento explícito.
import { ICONES_TOAST, type TipoToast } from './toast.constants';

interface ToastProps {
  mensagem: string;
  tipo: TipoToast;
  idBotaoFechar: string;
  aoFechar: () => void;
}

export function Toast({ mensagem, tipo, idBotaoFechar, aoFechar }: ToastProps) {
  const erro = tipo === 'erro';
  return (
    <div className={`aviso aviso--${tipo}`} role={erro ? 'alert' : 'status'} aria-live={erro ? 'assertive' : 'polite'}>
      <i className={`fa-solid ${ICONES_TOAST[tipo]} aviso__icone`} aria-hidden="true" />
      <div className="aviso__texto">{mensagem}</div>
      <button
        id={idBotaoFechar}
        type="button"
        className="aviso__fechar"
        aria-label="Fechar aviso"
        onClick={aoFechar}
      >
        ×
      </button>
    </div>
  );
}
