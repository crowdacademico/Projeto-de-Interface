# Projeto de Interface - CrowdAcadêmico

Protótipo visual **sem Node** - HTML/CSS/JS puros, sem `npm install`, sem
build step. Existe pra rodar em qualquer lugar rapidinho (mostrar pra
alguém, testar num PC qualquer) e pra sempre poder mostrar visualmente
onde o produto real (pasta `nest/` + `react/`, na raiz do repositório)
está indo, mesmo nas partes que ainda não foram construídas de verdade.

Tudo separado por TIPO de arquivo (`css/`, `js/`, `telas/`, `componentes/`, `dados-falsos/`), numerado. A numeração tem buracos (a área restrita saiu em 05-10-2026); arquivo novo pega o próximo número livre.

`css/0-style.css` e `js/0-script.js` são os dois ÚNICOS arquivos que
`index.html` referencia (`<link>`/`<script type="module">`) - o resto
entra via `@import` (CSS) ou `import`/`export` de módulo ES nativo do
navegador (JS, sem bundler). Ver os comentários no topo de cada um deles
pra entender por quê.

## Como rodar

Este protótipo carrega os fragmentos HTML via `fetch()` - **não dá pra
abrir `index.html` direto clicando duas vezes** (o navegador bloqueia
`fetch` em `file://`). Precisa de um servidor estático qualquer, por
exemplo:

```
python -m http.server 8080
```

E abrir `http://localhost:8080/`.

### Funciona sem internet

Desde 18-08-2026 (completo), **zero origens externas** - testado
navegando as 20 telas com toda requisição de rede que não seja
`localhost` bloqueada (Playwright `route().abort()`), sem nenhum erro:

| O que | Onde mora | Pra atualizar |
|---|---|---|
| Tailwind (Play CDN) | `vendor/tailwind.js` | `curl -sL -o vendor/tailwind.js https://cdn.tailwindcss.com` |
| Capas de projeto/hero | `imagens/*.jpg` | - |
| QR Code do Checkout | `imagens/qr-simulado.svg` | Padrão estático gerado uma vez (visual, não é um QR de verdade - não precisa ser escaneável, é protótipo) |
| Font Awesome 6.5.1 (ícones) | `vendor/font-awesome/` | `curl -sL -o vendor/font-awesome/css/all.min.css https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css` + os 8 arquivos de `webfonts/` da mesma origem |
| Inter / Fraunces / IBM Plex Mono | `vendor/fontes/*.woff2` + `css/8-fontes.css` | Só o subset **latin** (cobre todo acento do PT-BR - á, ã, ç, õ etc. estão em U+0000-00FF) foi baixado, não os subsets cirílico/vietnamita/etc. do Google Fonts. Pra pegar os links atualizados: `curl -A "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400..800&family=IBM+Plex+Mono:wght@400;600&display=swap"` e olhar só os blocos `/* latin */` |

**Verificar que não voltou hardcoded/dependência externa:**
```
grep -rn "text-\[10px\]\|text-\[11px\]\|bg-white\|text-slate-\|bg-slate-\|border-slate-\|indigo-" \
  telas/ componentes/ js/ dados-falsos/ | grep -v "2-compat-legado.js"
grep -rn "images.unsplash.com\|cdn.tailwindcss.com\|fonts.googleapis.com\|cdnjs.cloudflare.com\|qrserver.com" \
  telas/ componentes/ js/ dados-falsos/ index.html
```
Ambos devem voltar vazios (o segundo, exceto o comentário de atualização
em `index.html`).

## Login de teste

Não existe backend nem senha de verdade. O botão **Telas do protótipo** (canto inferior direito) tem **Entrar como Usuário Comum**, **Entrar como Pesquisador** e **Sair**. O Usuário Comum só apoia campanhas (painel do doador e Minha Conta). O Pesquisador também é usuário comum e abre ainda o painel do pesquisador e o Criar Projeto. Na tela de Login, os e-mails `usuario@crowdacademico.com.br` e `pesquisador@crowdacademico.com.br`, com qualquer senha, também entram.

## O que o protótipo NÃO tem

Área restrita (Painel Admin, cadastros, moderação). Ela existe só no sistema real (`react/`); aqui seria código parado.

## Estrutura

```
css/            0-style.css é o ponto de entrada (@import do resto)
js/             0-script.js é o ponto de entrada (import do resto + a ponte com window que os onclick="" precisam)
telas/          1 fragmento HTML por tela, carregado via fetch()
componentes/    cabeçalho, rodapé e o painel "Telas do protótipo"
dados-falsos/   todo dado mockado
```

## Para gastar menos token

O código não tem comentários de propósito (só 2, que evitam erros que já aconteceram): leia o código. A história das decisões fica fora daqui.
