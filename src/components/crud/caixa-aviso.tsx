// A caixa reúne contexto e consequência para avisos que precisam de explicação.
import type { ReactNode } from 'react';
import { TONS_CAIXA_AVISO } from './caixa-aviso.constants';

interface CaixaAvisoProps {
  titulo: ReactNode;
  children: ReactNode;
  tom?: keyof typeof TONS_CAIXA_AVISO;
  icone?: string;
  className?: string;
}

export function CaixaAviso({
  titulo,
  children,
  tom = 'info',
  icone = 'fa-circle-info',
  className = '',
}: CaixaAvisoProps) {
  return (
    <aside className={`aviso-caixa ${TONS_CAIXA_AVISO[tom]} ${className}`} role={tom === 'erro' ? 'alert' : 'note'}>
      <i className={`aviso-caixa__icone fa-solid ${icone}`} aria-hidden="true" />
      <div>
        <h2 className="subtitulo font-bold mb-1">{titulo}</h2>
        <div>{children}</div>
      </div>
    </aside>
  );
}
