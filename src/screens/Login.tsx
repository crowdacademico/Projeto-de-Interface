const conteudo = String.raw`<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 fundo-pagina">
    <div class="max-w-4xl w-full fundo-cartao rounded-2xl shadow-2xl border borda-padrao overflow-hidden lg:grid lg:grid-cols-2">
        <div class="superficie-escura relative overflow-hidden hidden lg:flex flex-col justify-between p-10">
            <div class="absolute inset-0 grade-medicao"></div>
            <div class="relative z-10">
                <div class="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-8 shadow-lg"><i class="fa-solid fa-flask"></i></div>
                <h2 class="titulo-secao texto-sobre-escuro-forte mb-4">Ciência financiada por quem acredita nela.</h2>
                <p class="texto-sobre-escuro leading-relaxed">Pesquisadores com perfil acadêmico público e curadoria em toda campanha. Contribuições via PIX, transparentes do primeiro real ao repasse final.</p>
            </div>
            <div class="relative z-10">
                <div class="numero numero--destaque texto-sobre-escuro-forte mb-1">143</div>
                <p class="text-sm texto-sobre-escuro">projetos financiados desde 2026</p>
            </div>
        </div>

        <div>
            <div class="p-10 text-center border-b borda-padrao relative overflow-hidden fundo-sutil lg:hidden">
                <div class="w-14 h-14 bg-primary rounded-xl mx-auto flex items-center justify-center text-white font-bold text-2xl mb-5 shadow-lg relative z-10"><i class="fa-solid fa-flask"></i></div>
                <h1 class="titulo-pagina texto-forte mb-2 relative z-10">Bem-vindo(a)</h1>
                <p class="text-sm texto-fraco font-medium relative z-10">Acesse sua conta para apoiar a ciência brasileira.</p>
            </div>

            <form id="form-login" class="p-10 space-y-6">
                <h1 class="hidden lg:block titulo-pagina texto-forte mb-2">Bem-vindo(a)</h1>
                <p class="hidden lg:block text-sm texto-fraco font-medium -mt-4">Acesse sua conta para apoiar a ciência brasileira.</p>

                <div class="chip-rf">
                    <i class="fa-solid fa-circle-info"></i>
                    Protótipo sem senha de verdade. Digite o e-mail de qualquer usuário falso (ver dados-falsos/1-usuarios.js) e qualquer senha, ou use o atalho <span class="font-mono">&lt;dev&gt;</span> no canto do cabeçalho.
                </div>

                <div class="campo" id="campo-login-email">
                    <label for="login-email" class="rotulo-campo">Seu E-mail</label>
                    <input type="email" id="login-email" required autocomplete="email" class="input-padrao" placeholder="ex.: admin@crowdacademico.com.br" />
                    <span id="erro-login" class="campo__erro hidden"></span>
                </div>

                <div class="campo">
                    <div class="flex justify-between items-center mb-2">
                        <label for="login-senha" class="rotulo-campo mb-0">Sua Senha</label>
                        <a href="#" onclick="mostrarAcao('Recuperação de senha simulada no protótipo.'); return false;" class="text-xs text-primary font-bold hover:underline">Esqueceu a senha?</a>
                    </div>
                    <input type="password" id="login-senha" required autocomplete="current-password" class="input-padrao" placeholder="••••••••" />
                </div>

                <button type="submit" id="login-submeter" class="w-full bg-dark hover:bg-black text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 flex items-center justify-center gap-2">
                    <span id="login-submeter-texto">Entrar</span>
                </button>

                <div class="relative flex py-4 items-center">
                    <div class="flex-grow border-t-2 borda-padrao"></div>
                    <span class="flex-shrink-0 mx-4 texto-fraco opacity-60 text-microrrotulo">Ou acesse com</span>
                    <div class="flex-grow border-t-2 borda-padrao"></div>
                </div>

                <button type="button" onclick="mostrarAcao('Login social com Google simulado no protótipo.');" class="w-full border-2 borda-padrao fundo-cartao texto-forte font-bold py-3.5 rounded-xl hover-fundo-sutil transition flex items-center justify-center gap-3 text-sm">
                    <span id="icone-provedor-google" class="shrink-0"></span>
                    Continuar com Google
                </button>

                <p class="text-sm texto-fraco text-center pt-2">
                    Ainda não tem cadastro? <a href="#" onclick="nav('cadastro'); return false;" class="text-primary font-bold underline">Clique aqui</a>
                </p>
            </form>
        </div>
    </div>
</div>
`;

export function TelaLogin() {
  return <main id="view-login" className="view-section fundo-pagina" dangerouslySetInnerHTML={{ __html: conteudo }} />;
}
