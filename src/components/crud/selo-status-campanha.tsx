// O estado da campanha ganha rótulo e tom consistentes em listas e detalhes.
import { STATUS_CAMPANHA } from './status.constants';

interface SeloStatusCampanhaProps {
  status: keyof typeof STATUS_CAMPANHA;
  descricao?: string;
}

export function SeloStatusCampanha({ status, descricao }: SeloStatusCampanhaProps) {
  const estado = STATUS_CAMPANHA[status];
  return (
    <span className={`badge ${estado.classe}`} aria-label={`Status da campanha: ${estado.rotulo}`}>
      <i className={`fa-solid ${estado.icone}`} aria-hidden="true" />
      {descricao ?? estado.rotulo}
    </span>
  );
}
