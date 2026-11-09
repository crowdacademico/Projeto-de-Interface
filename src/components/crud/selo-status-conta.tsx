// O estado de verificação do e-mail é apresentado sem confundi-lo com outros status.
interface SeloStatusContaProps {
  emailVerificado: boolean;
}

export function SeloStatusConta({ emailVerificado }: SeloStatusContaProps) {
  return (
    <span
      className={`badge flex items-center gap-1 ${emailVerificado ? 'badge-sucesso' : 'fundo-aviso texto-aviso'}`}
      aria-label={emailVerificado ? 'E-mail verificado' : 'E-mail não verificado'}
    >
      <i
        className={`fa-solid text-microrrotulo ${emailVerificado ? 'fa-check' : 'fa-triangle-exclamation'}`}
        aria-hidden="true"
      />
      {emailVerificado ? 'E-mail verificado' : 'E-mail não verificado'}
    </span>
  );
}
