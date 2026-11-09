// Um estado vazio explica a ausência de resultados e pode indicar o próximo passo.
import type { ReactNode } from 'react';

interface EstadoVazioProps {
  titulo: string;
  texto?: ReactNode;
  icone?: string;
  acao?: ReactNode;
}

export function EstadoVazio({
  titulo,
  texto,
  icone = 'fa-inbox',
  acao,
}: EstadoVazioProps) {
  return (
    <div className="estado-vazio" role="status">
      <div className="estado-vazio__icone" aria-hidden="true">
        <i className={`fa-solid ${icone}`} />
      </div>
      <div className="estado-vazio__titulo">{titulo}</div>
      {texto && <p className="estado-vazio__texto">{texto}</p>}
      {acao && <div className="estado-vazio__acao">{acao}</div>}
    </div>
  );
}
