const conteudo = String.raw`<div class="fundo-pagina py-16 min-h-screen">
    <div class="max-w-2xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
            <div id="cabecalho-pagina-notificacoes"></div>
            <button type="button" onclick="marcarTodasNotificacoesLidas()" class="text-sm font-bold texto-marca hover:underline">Marcar todas como lidas</button>
        </div>

        <div id="notificacoes-lista" class="space-y-2"></div>
    </div>
</div>
`;

export function TelaNotificacoes() {
  return <main id="view-notificacoes" className="view-section flex-grow" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
