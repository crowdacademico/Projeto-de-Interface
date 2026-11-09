const conteudo = String.raw`<div class="fundo-pagina py-16 min-h-screen">
    <div class="max-w-3xl mx-auto px-4">
        <div id="cabecalho-pagina-transparencia"></div>

        <section class="mb-12">
            <h2 class="titulo-secao mb-4">Composição da taxa</h2>
            <div class="escala-progresso__trilho mb-2">
                <div id="transparencia-barra-composicao"></div>
            </div>
            <div class="escala-progresso__eixo mb-4">
                <span class="paragrafo-denso">0%</span>
                <span class="paragrafo-denso">25%</span>
                <span class="paragrafo-denso">50%</span>
                <span class="paragrafo-denso">75%</span>
                <span class="paragrafo-denso">100%</span>
            </div>
            <div id="transparencia-legenda-composicao" class="flex flex-wrap gap-x-6 gap-y-2"></div>
        </section>

        <section class="mb-12">
            <h2 class="titulo-secao mb-4">Simule seu apoio</h2>
            <div class="painel-leitura">
                <div id="transparencia-simulador-campo"></div>
                <div id="transparencia-simulador-decomposicao" class="painel-leitura__decomposicao"></div>
                <div class="painel-leitura__resultado">
                    <span class="painel-leitura__resultado-rotulo">O projeto recebe</span>
                    <strong id="transparencia-simulador-resultado" class="painel-leitura__resultado-valor"></strong>
                </div>
            </div>
        </section>

        <section class="mb-12">
            <h2 class="titulo-secao mb-4">Prazos por meio de pagamento</h2>
            <div class="overflow-x-auto cartao p-0">
                <div id="transparencia-tabela-meios"></div>
            </div>
        </section>

        <section class="mb-12">
            <h2 class="titulo-secao mb-4">Política de estorno</h2>
            <p id="transparencia-politica-estorno" class="paragrafo texto-padrao"></p>
        </section>

        <section>
            <h2 class="titulo-secao mb-4">O que a plataforma não faz</h2>
            <ul id="transparencia-o-que-nao-fazemos" class="space-y-3"></ul>
        </section>
    </div>
</div>
`;

export function TelaTransparencia() {
  return <main id="view-transparencia" className="view-section flex-grow" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
