const conteudo = String.raw`<div class="fundo-pagina py-16 min-h-screen">
    <div class="max-w-4xl mx-auto px-4">
        <div id="cabecalho-pagina-como-funciona"></div>
    </div>

    <div class="max-w-6xl mx-auto px-4 mb-20">
        <h2 class="titulo-secao mb-10 text-center">Três perfis, uma experiência adaptada</h2>
        <div id="como-funciona-perfis" class="flex flex-col gap-16"></div>
    </div>

    <div class="max-w-4xl mx-auto px-4">
        <div id="como-funciona-abas" class="abas-simples mb-10"></div>
        <div id="como-funciona-conteudo" class="mb-16"></div>

        <div id="perguntas-frequentes" class="scroll-mt-24">
            <h2 class="titulo-secao mb-6">Perguntas frequentes</h2>
            <div id="como-funciona-faq" class="space-y-3"></div>
        </div>
    </div>
</div>
`;

export function TelaComoFunciona() {
  return <main id="view-como-funciona" className="view-section flex-grow" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
