const conteudo = String.raw`
<div class="fundo-pagina py-10 min-h-screen">
    <div class="w-full max-w-7xl mx-auto px-4">

        <div class="cabecalho-catalogo mb-8 pb-5 border-b borda-padrao">
            <div id="cabecalho-pagina-explorar"></div>
            <p id="explorar-contagem" class="paragrafo-denso"></p>
        </div>

        <div class="barra-controles-catalogo w-full flex flex-col mb-8 gap-4" role="group" aria-label="Filtros de projetos">
            <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div id="explorar-barra-busca" class="w-full sm:max-w-xl"></div>

                <div class="flex flex-wrap items-center gap-3 shrink-0">
                    <div class="flex items-center border borda-padrao rounded-lg overflow-hidden"
                         role="group"
                         aria-label="Modo de exibição">
                        <button
                            type="button"
                            id="explorar-modo-grade"
                            aria-pressed="true"
                            aria-label="Ver em grade"
                            class="w-9 h-9 flex items-center justify-center fundo-realce texto-forte">
                            <i class="fa-solid fa-grip"></i>
                        </button>

                        <button
                            type="button"
                            id="explorar-modo-lista"
                            aria-pressed="false"
                            aria-label="Ver em lista"
                            class="w-9 h-9 flex items-center justify-center texto-fraco hover-fundo-sutil transition-colors">
                            <i class="fa-solid fa-list"></i>
                        </button>
                    </div>

                    <label for="explorar-ordenacao" class="rotulo shrink-0">Ordenar por</label>
                    <select id="explorar-ordenacao" class="input-padrao sm:max-w-xs">
                        <option value="recentes">Mais recentes</option>
                        <option value="percentual">Maior percentual atingido</option>
                        <option value="prazo">Encerrando em breve</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-start">
                <div id="explorar-filtros-conhecimento" class="contents"></div>

                <div class="cartao p-4">
                    <h2 class="rotulo mb-3">Status</h2>
                    <div class="flex flex-wrap gap-2" id="explorar-filtro-status">
                        <label class="filtro-chip">
                            <input type="radio" name="explorar-status" value="todos" checked class="sr-only">
                            Todos
                        </label>
                        <label class="filtro-chip">
                            <input type="radio" name="explorar-status" value="em-captacao" class="sr-only">
                            Em captação
                        </label>
                        <label class="filtro-chip">
                            <input type="radio" name="explorar-status" value="em-breve" class="sr-only">
                            Em breve
                        </label>
                        <label class="filtro-chip">
                            <input type="radio" name="explorar-status" value="financiada" class="sr-only">
                            Financiados
                        </label>
                    </div>
                </div>

                <div class="cartao p-4">
                    <h2 class="rotulo mb-3">Modelo de financiamento</h2>
                    <div class="flex flex-wrap gap-2" id="explorar-filtro-modelo">
                        <label class="filtro-chip">
                            <input type="radio" name="explorar-modelo" value="todos" checked class="sr-only">
                            Todos
                        </label>
                        <label class="filtro-chip">
                            <input type="radio" name="explorar-modelo" value="tudo-ou-nada" class="sr-only">
                            Tudo ou Nada
                        </label>
                        <label class="filtro-chip">
                            <input type="radio" name="explorar-modelo" value="flexivel" class="sr-only">
                            Flexível
                        </label>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3">
                <div id="explorar-fichas-filtros" class="flex flex-wrap gap-2"></div>
                <button
                    type="button"
                    id="explorar-limpar-filtros"
                    class="text-xs font-bold text-primary hover:underline">
                    Limpar filtros
                </button>
            </div>
        </div>

        <div class="w-full min-w-0">

                <div
                    id="explorar-grade"
                    class="grade-campanhas">
                </div>

                <div id="explorar-vazio" class="hidden"></div>

                <div id="explorar-paginacao" class="mt-10 text-center"></div>

        </div>
    </div>
</div>
`;

export function TelaExplorar() {
  return <main id="view-explorar" className="view-section flex-grow" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
