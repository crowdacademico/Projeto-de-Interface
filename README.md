# Projeto de Interface - CrowdAcadêmico

Aplicação pública em migração para **React + TypeScript + Vite**. Este projeto continua separado da aplicação restrita e não inclui o NestJS. As telas estão em `src/screens/`; os componentes compartilhados ficam em `src/components/`, organizados por papel. A lógica existente em `js/` e os dados em `dados-falsos/` são mantidos durante a conversão para preservar as interações.

## Como rodar

Instale as dependências e inicie o servidor Vite:

```sh
npm install
npm run dev
```

Para validar a compilação de produção, rode `npm run build`.

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
  src/ js/ dados-falsos/ | grep -v "2-compat-legado.js"
grep -rn "images.unsplash.com\|cdn.tailwindcss.com\|fonts.googleapis.com\|cdnjs.cloudflare.com\|qrserver.com" \
  src/ js/ dados-falsos/ index.html
```
Ambos devem voltar vazios (o segundo, exceto o comentário de atualização
em `index.html`).

## Login de teste

Não existe backend nem senha de verdade. O botão **Telas do protótipo** (canto inferior direito) tem **Entrar como Usuário Comum**, **Entrar como Pesquisador** e **Sair**. O Usuário Comum só apoia campanhas (painel do doador e Minha Conta). O Pesquisador também é usuário comum e abre ainda o painel do pesquisador e o Criar Projeto. Na tela de Login, os e-mails `usuario@crowdacademico.com.br` e `pesquisador@crowdacademico.com.br`, com qualquer senha, também entram.

## O que o protótipo NÃO tem

Área restrita (Painel Admin, cadastros, moderação). Ela existe só no sistema real (`react/`); aqui seria código parado.

## Estrutura atual

```
src/
  components/    Componentes compartilhados em crud/, input/, layout/,
                 pagination/, search/ e auth/
  data/          Dados de domínio usados por componentes
  renderizadores/ Adaptadores React para as telas e scripts legados
  screens/       Telas TSX
  types/         Tipos compartilhados
css/             0-style.css importa a folha de estilos do protótipo
js/              Lógica JavaScript existente, temporariamente usada pelas telas TSX
dados-falsos/    Dados de demonstração
imagens/         Imagens locais
```

A migração está em andamento: telas e componentes são montados por React em `.tsx`. Componentes reutilizáveis mantêm os contratos de DOM necessários aos scripts existentes, enquanto os renderizadores conectam os fluxos legados aos componentes. A aplicação restrita não é alterada.

O alias Vite `@restrita` aponta para `../crowdacademico/react/src` e permite reutilizar componentes compartilhados, como `components/input/campo.tsx`. Para desenvolver com esse alias, mantenha os repositórios `Projeto-de-Interface` e `crowdacademico` lado a lado dentro da mesma pasta.

O formulário público de criação de campanha espelha os campos e etapas do CrowdAcadêmico: dados (título, área, meta, modelo, descrição, datas e vídeo), orçamento, cronograma e revisão. O formulário continua demonstrativo e sem integração com a API restrita.

## Guia de estilos

A tela **Guia de estilos** reúne exemplos interativos dos componentes compartilhados. Acesse pelo botão **Telas do protótipo**, no canto inferior direito, e selecione **Guia de estilos**.

## Para gastar menos token

Os componentes compartilhados começam com um comentário curto sobre seu propósito; detalhes de implementação devem ser lidos no código.
