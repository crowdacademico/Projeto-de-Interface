// Copia da área restrita só o que a área pública usa: regras de componente e os tokens que elas pedem.
// Rodar (precisa só do Node, sem npm install):  node scripts/sincronizar-css-restrita.mjs
//
// A RESTRITA MANDA. Para trazer mais um componente: acrescente a classe em CLASSES e rode de novo.
// Para a restrita assumir um token que a pública também define: acrescente em TOKENS_DA_RESTRITA.
// Classe/token que a restrita tem e a pública não usa NÃO entra aqui (ex.: btn-dev, interruptor).
//
// Gera dois arquivos (não editar à mão):
//   css/4-componentes-restrita.css  regras copiadas (sem @layer: o Tailwind do CDN da pública não usa camadas)
//   css/5-tokens-restrita.css       tokens que essas regras pedem e a pública não tinha, mais os de TOKENS_DA_RESTRITA
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const PASTA_RESTRITA = resolve(aqui, '../../crowdacademico/react/src/assets/css');
const PASTA_PUBLICA = resolve(aqui, '../css');
// Ordem importa: utilitários de cor (1-cores) antes dos componentes (4-componentes), como a pública já era.
const ORIGENS = ['1-cores.css', '2-tipografia.css', '4-componentes.css'].map((a) => resolve(PASTA_RESTRITA, a));
const FONTES_DE_TOKENS = ['tailwind-theme.css', '1-cores.css', '2-tipografia.css', '3-base.css'].map((a) => resolve(PASTA_RESTRITA, a));
const DESTINO_REGRAS = resolve(PASTA_PUBLICA, '4-componentes-restrita.css');
const DESTINO_TOKENS = resolve(PASTA_PUBLICA, '5-tokens-restrita.css');
const TOKENS_DA_PUBLICA = resolve(PASTA_PUBLICA, '9-CSS-do-projeto-de-interface.css');

const CLASSES = new Set([
  'btn', 'btn-primary', 'btn-secondary', 'btn-danger', 'btn-grande',
  'badge', 'badge-sucesso', 'badge-neutro',
  'input-padrao',
  'estado-vazio', 'estado-vazio__icone', 'estado-vazio__titulo',
  'erro-campo', 'enfase', 'btn-pequeno', 'icone-pequeno', 'icone-grande',
  // ficha de leitura e modal (a estrutura do modal em si mora em 9-CSS-do-projeto-de-interface.css)
  'rotulo-leitura', 'titulo-bloco', 'titulo-bloco--linha', 'campo-ficha__valor', 'rolagem-estavel', 'fundo-escurecido', 'texto-herdado',
  // utilitários de cor
  'fundo-pagina', 'fundo-cartao', 'fundo-elevado', 'fundo-sutil', 'fundo-realce', 'hover-fundo-sutil',
  'fundo-sucesso', 'fundo-erro', 'fundo-aviso', 'fundo-info',
  'texto-forte', 'texto-padrao', 'texto-fraco', 'hover-texto-forte', 'hover-texto-erro', 'texto-marca',
  'texto-sucesso', 'texto-erro', 'texto-aviso', 'texto-info',
  'borda-padrao', 'borda-forte', 'borda-sucesso', 'borda-erro', 'borda-aviso', 'borda-marca',
  // tipografia (decisão de 11-11-2026: a restrita manda até aqui; as regras antigas da pública estão no commit 7406424)
  'titulo-pagina', 'titulo-secao', 'subtitulo', 'paragrafo', 'paragrafo-denso', 'legenda', 'rotulo-campo',
]);

// Tokens que a pública também definia, mas com valor parecido (diferença de até 40 em 255 por canal):
// aqui a restrita assume o valor. A definição antiga sai de 9-CSS-do-projeto-de-interface.css. Fora da lista ficam os que diferem muito
// (borda, borda-forte, bordas e texto de aviso, sombras, marca) e a identidade tipográfica (fontes).
const TOKENS_DA_RESTRITA = [
  '--cor-texto-forte', '--cor-texto', '--cor-texto-fraco',
  '--cor-fundo-pagina', '--cor-fundo-cartao', '--cor-fundo-elevado', '--cor-fundo-sutil', '--cor-fundo-hover',
  '--cor-texto-sucesso', '--cor-texto-erro', '--cor-texto-info',
  '--cor-avatar-2', '--cor-avatar-3', '--cor-avatar-4',
  '--font-size-xs', '--font-size-sm', '--font-size-base', '--font-size-lg', '--font-size-xl', '--font-size-2xl',
  '--font-size-3xl',
  // usados pelo modal de ficha (9-CSS-do-projeto-de-interface.css)
  '--camada-modal', '--distancia-topo-modal', '--largura-ficha', '--altura-modal',
];

// Seletores da restrita que não servem na pública (a pública monta o estado vazio com outra estrutura).
const IGNORAR = new Set(['.estado-vazio > div']);

const semComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '');

function blocos(texto) {
  const lista = [];
  let i = 0;
  while (i < texto.length) {
    const abre = texto.indexOf('{', i);
    if (abre === -1) break;
    let nivel = 1;
    let j = abre + 1;
    while (j < texto.length && nivel > 0) {
      if (texto[j] === '{') nivel++;
      else if (texto[j] === '}') nivel--;
      j++;
    }
    lista.push({ prelude: texto.slice(i, abre).trim(), corpo: texto.slice(abre + 1, j - 1) });
    i = j;
  }
  return lista;
}

function dividirSeletores(prelude) {
  const partes = [];
  let nivel = 0;
  let atual = '';
  for (const c of prelude) {
    if (c === '(' || c === '[') nivel++;
    if (c === ')' || c === ']') nivel--;
    if (c === ',' && nivel === 0) { partes.push(atual.trim()); atual = ''; } else atual += c;
  }
  if (atual.trim()) partes.push(atual.trim());
  return partes;
}

// Devolve o seletor (já sem as classes que a pública não usa) ou null se não sobra nada.
function filtrarSeletor(seletor) {
  const where = seletor.match(/^:where\(([\s\S]*)\)$/); // ex.: :where(.titulo-pagina, .rotulo-leitura)
  if (where) {
    const dentro = dividirSeletores(where[1]).filter((s) => filtrarSeletor(s));
    return dentro.length ? `:where(${dentro.join(', ')})` : null;
  }
  if (IGNORAR.has(seletor.replace(/\s+/g, ' '))) return null;
  const classes = [...seletor.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
  return classes.length > 0 && classes.every((c) => CLASSES.has(c)) ? seletor : null;
}

function processar(texto, recuo) {
  const saida = [];
  for (const { prelude, corpo } of blocos(texto)) {
    if (prelude.startsWith('@layer')) {
      saida.push(...processar(corpo, recuo));
    } else if (prelude.startsWith('@media')) {
      const dentro = processar(corpo, recuo + '  ');
      if (dentro.length) saida.push(`${recuo}${prelude} {`, ...dentro, `${recuo}}`);
    } else if (prelude.startsWith('@')) {
      continue; // @keyframes e afins: nenhum dos componentes da lista precisa
    } else {
      if (corpo.includes('{')) throw new Error(`Regra aninhada em "${prelude}": ajustar o script.`);
      const seletores = dividirSeletores(prelude).map(filtrarSeletor).filter(Boolean);
      if (!seletores.length) continue;
      const declaracoes = corpo.split(';').map((d) => d.trim()).filter(Boolean).map((d) => `${recuo}  ${d};`);
      saida.push(`${recuo}${seletores.join(`,\n${recuo}`)} {`, ...declaracoes, `${recuo}}`, '');
    }
  }
  return saida;
}

// ---- Tokens: valor final (claro e escuro) de cada token da restrita ----
function coletarTokens(arquivos) {
  const claro = {};
  const escuro = {};
  const visitar = (texto) => {
    for (const { prelude, corpo } of blocos(texto)) {
      if (prelude.startsWith('@layer')) visitar(corpo);
      else if (prelude.startsWith('@media')) { if (!/prefers-color-scheme/.test(prelude)) visitar(corpo); }
      else if (/@theme\s*$/.test(prelude)) lerDeclaracoes(corpo, claro);
      else if (prelude.startsWith('@')) continue;
      else if (/escuro/.test(prelude)) lerDeclaracoes(corpo, escuro);
      else if (/:root|claro/.test(prelude)) lerDeclaracoes(corpo, claro);
    }
  };
  const lerDeclaracoes = (corpo, alvo) => {
    for (const m of corpo.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) alvo[m[1]] = m[2].trim();
  };
  for (const arq of arquivos) visitar(semComentarios(readFileSync(arq, 'utf8')));
  return { claro, escuro };
}

function definicoesDa(arquivo) {
  return new Set([...semComentarios(readFileSync(arquivo, 'utf8')).matchAll(/^\s*(--[a-zA-Z0-9-]+)\s*:/gm)].map((m) => m[1]));
}

const regras = ORIGENS.flatMap((arq) => processar(semComentarios(readFileSync(arq, 'utf8')), ''));
const gerado = regras.join('\n');
writeFileSync(
  DESTINO_REGRAS,
  `/* GERADO por scripts/sincronizar-css-restrita.mjs a partir de
   crowdacademico/react/src/assets/css/1-cores.css, 2-tipografia.css e 4-componentes.css. NÃO editar à mão:
   para mudar um componente compartilhado, mude na restrita e rode o script.
   Ajuste que só existe no Projeto de Interface vai em 9-CSS-do-projeto-de-interface.css (seção 6). */\n\n${gerado.trim()}\n`,
);

const restrita = coletarTokens(FONTES_DE_TOKENS);
const daPublica = definicoesDa(TOKENS_DA_PUBLICA); // o CSS do Projeto de Interface já sem os tokens que a restrita assumiu
const importar = new Set(TOKENS_DA_RESTRITA);
// tokens pedidos pelas regras copiadas que a pública não define (e os que eles pedem, em cadeia)
const fila = [...gerado.matchAll(/var\((--[a-zA-Z0-9-]+)/g)].map((m) => m[1]);
const todos = { ...restrita.claro, ...restrita.escuro };
const locais = new Set([...gerado.matchAll(/^\s*(--[a-zA-Z0-9-]+)\s*:/gm)].map((m) => m[1])); // definidos dentro da própria regra
const semDefinicao = [];
for (const t of [...fila, ...importar]) {
  if (locais.has(t)) continue;
  if (daPublica.has(t) && !TOKENS_DA_RESTRITA.includes(t)) continue; // a pública já tem: o valor dela vale
  if (!(t in todos)) { semDefinicao.push(t); continue; }
  importar.add(t);
}
const mantidos = (t) => daPublica.has(t) && !TOKENS_DA_RESTRITA.includes(t) && !importar.has(t);
function resolver(valor, mapa, prof = 0) {
  if (prof > 12) return valor;
  return valor.replace(/var\((--[a-zA-Z0-9-]+)(?:\s*,\s*([^)]*))?\)/g, (_, nome, reserva) => {
    if (mantidos(nome)) return `var(${nome})`; // a pública já tem: o valor dela continua valendo
    const v = mapa[nome];
    if (v === undefined) { if (reserva === undefined) semDefinicao.push(nome); return reserva ?? `var(${nome})`; }
    return resolver(v, mapa, prof + 1);
  });
}
const mapaClaro = restrita.claro;
const mapaEscuro = { ...restrita.claro, ...restrita.escuro };
const linhasClaro = [];
const linhasEscuro = [];
for (const t of [...importar].sort()) {
  const c = resolver(mapaClaro[t] ?? mapaEscuro[t], mapaClaro);
  const e = resolver(mapaEscuro[t], mapaEscuro);
  linhasClaro.push(`  ${t}: ${c};`);
  if (e !== c) linhasEscuro.push(`  ${t}: ${e};`);
}
const escuroDentro = linhasEscuro.map((l) => `  ${l}`).join('\n');
writeFileSync(
  DESTINO_TOKENS,
  `/* GERADO por scripts/sincronizar-css-restrita.mjs (valores resolvidos da restrita). NÃO editar à mão.
   Tokens que os componentes copiados pedem e a pública não tinha, mais os de TOKENS_DA_RESTRITA no script,
   onde a restrita assume o valor. */
:root {
${linhasClaro.join('\n')}
}
${linhasEscuro.length ? `
:root[data-tema='escuro'] {
${linhasEscuro.join('\n')}
}

@media (prefers-color-scheme: dark) {
  :root[data-tema='sistema'] {
${escuroDentro}
  }
}
` : ''}`,
);

const geradas = new Set([...gerado.matchAll(/^\s*\.([a-zA-Z0-9_-]+)/gm)].map((m) => m[1]));
console.log(`Regras: ${DESTINO_REGRAS}`);
console.log(`Tokens: ${DESTINO_TOKENS} (${importar.size} tokens)`);
console.log(`Classes pedidas: ${CLASSES.size}; com regra na restrita: ${[...CLASSES].filter((c) => geradas.has(c)).length}`);
console.log(`Classes sem regra na restrita: ${[...CLASSES].filter((c) => !geradas.has(c)).join(', ') || '(nenhuma)'}`);
console.log(`Tokens sem definição em lugar nenhum: ${[...new Set(semDefinicao)].filter((t) => !locais.has(t)).join(', ') || '(nenhum)'}`);
