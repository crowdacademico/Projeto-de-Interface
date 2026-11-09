const conteudo = String.raw`    <div class="max-w-4xl mx-auto px-4">
        <div class="chip-rf inline-flex items-center gap-2 fundo-realce texto-padrao px-3 py-2 rounded-full border borda-padrao mb-6">Requisito Funcional: <span class="rf-inline">RF-020 / RF-024 / RF-027 / RF-028</span>. Formulário de submissão de campanha</div>
        <div class="mb-8">
            <h1 class="titulo-pagina texto-forte">Submeter Projeto Científico</h1>
            <p class="text-sm texto-fraco mt-2 max-w-xl">As campanhas submetidas ficam em status <strong>Aguardando Aprovação</strong> até serem revisadas pelo administrador. Cada pesquisador pode ter no máximo 2 campanhas simultâneas em andamento ou aguardando aprovação.</p>
        </div>

        <div class="fundo-cartao rounded-2xl shadow-xl border borda-padrao p-10 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-500"></div>

            <div id="criar-campanha-aviso-curadoria" class="mb-10"></div>

            <nav id="criar-campanha-passos" class="passos" aria-label="Etapas do formulário"></nav>

            <form id="form-criar-campanha" onsubmit="event.preventDefault(); submeterCriarCampanha();">
                <div id="passo-dados" class="tab-content active space-y-8">
                    <div id="criar-campanha-campo-titulo"></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div id="criar-campanha-campo-area"></div>
                        <div id="criar-campanha-campo-meta"></div>
                    </div>
                    <div id="criar-campanha-campo-modelo"></div>
                    <div id="criar-campanha-campo-descricao"></div>
                    <div id="criar-campanha-contador-descricao" aria-live="polite"></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div id="criar-campanha-campo-inicio"></div>
                        <div id="criar-campanha-campo-fim"></div>
                    </div>
                    <p id="criar-campanha-ajuda-prazo" class="campo__ajuda -mt-6">
                        A campanha precisa durar entre 15 e 60 dias, começando hoje ou depois. O fim é sugerido 30 dias após o início.
                    </p>
                    <div id="criar-campanha-campo-video"></div>
                </div>

                <div id="passo-orcamento" class="tab-content space-y-8">
                    <div class="campo">
                        <div class="flex justify-between items-baseline mb-4">
                            <span class="rotulo-campo mb-0">Itens do orçamento</span>
                            <button type="button" id="criar-campanha-rubrica-add" class="text-xs font-bold texto-marca hover:underline"><i class="fa-solid fa-plus"></i> Adicionar item</button>
                        </div>
                        <div id="criar-campanha-rubricas" class="space-y-3"></div>
                        <div id="criar-campanha-rubricas-soma" class="mt-4 rounded-xl p-4 text-sm font-bold flex justify-between items-center"></div>
                    </div>
                </div>

                <div id="passo-cronograma" class="tab-content space-y-8">
                    <div>
                        <h2 class="subtitulo texto-forte mb-2">Cronograma do projeto</h2>
                        <p class="paragrafo texto-padrao mb-4">Informe pelo menos três marcos, com título e data prevista. Cada marco deve ocorrer na data de início da campanha ou depois.</p>
                        <div id="criar-campanha-marcos" class="space-y-3"></div>
                        <button type="button" id="criar-campanha-marco-add" class="mt-4 text-xs font-bold texto-marca hover:underline">
                            <i class="fa-solid fa-plus" aria-hidden="true"></i> Adicionar marco
                        </button>
                    </div>
                </div>

                <div id="passo-revisao" class="tab-content space-y-8">
                    <div>
                        <p class="rotulo-campo mb-4">Pré-visualização: como o card aparece no catálogo</p>
                        <div id="criar-campanha-preview" class="max-w-sm"></div>
                    </div>
                    <div>
                        <p class="rotulo-campo mb-4">Checklist antes de enviar</p>
                        <div id="criar-campanha-checklist" class="space-y-2"></div>
                    </div>
                </div>

                <div id="criar-campanha-rodape-acoes"></div>
            </form>
        </div>
    </div>
`;

export function TelaCriarCampanha() {
  return <main id="view-criar-campanha" className="view-section flex-grow fundo-sutil py-12" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
