// O ícone do provedor é reutilizável sem SVG com cores fora dos tokens do projeto.
interface IconeProvedorProps {
  provedor: 'google';
}

export function IconeProvedor({ provedor }: IconeProvedorProps) {
  return <i className={`fa-brands fa-${provedor}`} aria-hidden="true" />;
}
