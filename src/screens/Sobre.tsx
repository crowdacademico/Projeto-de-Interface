const conteudo = String.raw`<div class="fundo-pagina py-16 min-h-screen">
    <div class="max-w-4xl mx-auto px-4">
        <div id="cabecalho-pagina-sobre"></div>

        <section class="mb-14">
            <h2 class="titulo-secao mb-4">Nossa missão</h2>
            <div id="sobre-missao" class="space-y-4"></div>
        </section>

        <section class="mb-14">
            <h2 class="titulo-secao mb-2">Como funciona a curadoria</h2>
            <p class="paragrafo texto-padrao mb-6">Toda campanha passa pelas mesmas quatro etapas antes de entrar em captação.</p>
            <div id="sobre-etapas-curadoria" class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6"></div>
            <div id="sobre-metricas-curadoria" class="grid grid-cols-3 gap-4"></div>
        </section>

        <section class="mb-14">
            <h2 class="titulo-secao mb-4">Moderação e denúncias</h2>
            <p class="paragrafo texto-padrao mb-4">Após a publicação, qualquer campanha pode ser denunciada por apoiadores ou visitantes. Denúncias são avaliadas pela moderação. Se uma campanha for encerrada por moderação, a página sai do ar e valem as regras do modelo: no Tudo ou Nada, as contribuições são devolvidas; no Flexível, quem apoiou com conta recebe orientação por e-mail, e o ressarcimento é responsabilidade do pesquisador.</p>
        </section>

        <footer class="mt-16 pt-8 border-t borda-padrao">
            <div id="sobre-ficha-tecnica" class="text-xs texto-fraco leading-relaxed"></div>
        </footer>
    </div>
</div>
`;

export function TelaSobre() {
  return <main id="view-sobre" className="view-section flex-grow" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
