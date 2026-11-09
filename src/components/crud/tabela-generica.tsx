// Uma tabela semântica única mantém cabeçalhos e listas alinhados e acessíveis.
import type { ReactNode } from 'react';

interface TabelaGenericaProps {
  colunas: string[];
  legenda?: string;
  idCorpo?: string;
  children?: ReactNode;
}

export function TabelaGenerica({ colunas, legenda, idCorpo, children }: TabelaGenericaProps) {
  return (
    <table className="tabela-simples">
      {legenda && <caption className="sr-only">{legenda}</caption>}
      <thead>
        <tr>
          {colunas.map((coluna) => (
            <th key={coluna} scope="col">
              {coluna}
            </th>
          ))}
        </tr>
      </thead>
      <tbody id={idCorpo}>{children}</tbody>
    </table>
  );
}
