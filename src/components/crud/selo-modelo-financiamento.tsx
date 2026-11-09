// O modelo de financiamento mantém o mesmo selo em cartões e pré-visualizações.
interface SeloModeloFinanciamentoProps {
  modelo: 'flexivel' | 'tudo-ou-nada';
  className?: string;
}

export function SeloModeloFinanciamento({ modelo, className = '' }: SeloModeloFinanciamentoProps) {
  const flexivel = modelo === 'flexivel';
  const classesModelo = flexivel ? 'texto-info borda-info' : 'texto-aviso borda-aviso';
  return (
    <span
      className={`badge-flutuante microrrotulo border-2 ${className || classesModelo}`}
    >
      {flexivel ? 'Flexível' : 'Tudo ou Nada'}
    </span>
  );
}
