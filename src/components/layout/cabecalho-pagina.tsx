// O cabeçalho de página mantém título, descrição e trilha de navegação consistentes.
const conteudo = String.raw`<template id="template-cabecalho-pagina">
    <div>
        <div data-cabecalho-migalhas></div>
        <h1 class="titulo-pagina" data-cabecalho-titulo></h1>
        <p class="paragrafo texto-padrao hidden" data-cabecalho-descricao></p>
    </div>
</template>
`;

export function CabecalhoPagina() {
  return <div id="app-cabecalho-pagina" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
