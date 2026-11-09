// A busca padroniza o rótulo acessível, ícone e campo nas listas do projeto.
interface BarraBuscaProps {
  id: string;
  rotulo: string;
  placeholder: string;
  className?: string;
  campoClassName?: string;
}

export function BarraBusca({
  id,
  rotulo,
  placeholder,
  className = '',
  campoClassName = '',
}: BarraBuscaProps) {
  return (
    <div className={`busca-catalogo ${className}`}>
      <span className="busca-catalogo__indice" aria-hidden="true">
        <i className="fa-solid fa-magnifying-glass" />
      </span>
      <label htmlFor={id} className="sr-only">
        {rotulo}
      </label>
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        className={`busca-catalogo__campo ${campoClassName}`}
      />
    </div>
  );
}
