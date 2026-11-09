const conteudo = String.raw`<div class="max-w-6xl mx-auto px-4">
    <div id="migalhas-minhas-campanhas"></div>
    <div id="conteudo-minhas-campanhas"></div>
</div>
`;

export function TelaMinhasCampanhas() {
  return <main id="view-minhas-campanhas" className="view-section flex-grow fundo-sutil py-10" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
