// Dicas curtas usam um alvo focável e a mesma relação acessível em toda a interface.
interface TooltipProps {
  id: string;
  texto: string;
}

export function Tooltip({ id, texto }: TooltipProps) {
  return (
    <span
      id={id}
      role="tooltip"
      className="pointer-events-none absolute left-4 top-full z-50 mt-1 w-max max-w-60 rounded-md fundo-institucional px-3 py-2 text-xs texto-sobre-escuro opacity-0 shadow-lg transition-opacity group-focus-within/filter:opacity-100 group-hover/filter:opacity-100"
    >
      {texto}
    </span>
  );
}
