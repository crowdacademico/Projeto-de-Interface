const conteudo = String.raw`<div id="view-apoio-confirmado-conteudo"></div>
`;

export function TelaApoioConfirmado() {
  return <main id="view-apoio-confirmado" className="view-section flex-grow fundo-sutil" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
