// O modal centraliza semântica, fechamento por Esc e gestão de foco para diálogos.
import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocoDialogo } from './use-foco-dialogo';

interface ModalBaseProps {
  aberto: boolean;
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
  className?: string;
  classNameCamada?: string;
  tamanho?: 'padrao' | 'gaveta';
  id?: string;
}

export function ModalBase({
  aberto,
  titulo,
  aoFechar,
  children,
  className = '',
  classNameCamada = '',
  tamanho = 'padrao',
  id,
}: ModalBaseProps) {
  const idTitulo = useId();
  const referencia = useRef<HTMLDivElement>(null);
  useFocoDialogo(referencia, aberto, aoFechar);

  if (!aberto) return null;
  const estiloDimensoes =
    tamanho === 'gaveta'
      ? { width: 'var(--largura-modal-gaveta)', maxWidth: 'var(--largura-modal-gaveta)' }
      : undefined;

  return createPortal(
    <div
      className={`fixed inset-0 modal-camada flex justify-end veu-modal ${classNameCamada}`}
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <section
        ref={referencia}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        className={`h-full w-full max-w-sm overflow-y-auto fundo-cartao shadow-2xl outline-none ${className}`}
        style={estiloDimensoes}
      >
        <h2 id={idTitulo} className="sr-only">
          {titulo}
        </h2>
        {children}
      </section>
    </div>,
    document.body,
  );
}
