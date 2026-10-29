import { escaparHtml } from './1-utilitarios.js';

export function htmlCartaoFormulario({ icone, titulo, subtitulo, variante = 'padrao', conteudoHtml, rodapeHtml }) {
  const classeIcone = variante === 'perigo' ? 'fundo-erro texto-erro' : 'bg-primary text-white';
  return `
        <div class="p-4 sm:p-8 fundo-pagina">
            <div class="mx-auto w-full max-w-2xl">
                <div class="fundo-cartao rounded-2xl shadow-2xl border borda-forte">
                    <div class="p-10 text-center border-b borda-padrao fundo-sutil rounded-t-2xl">
                        <div class="w-14 h-14 rounded-xl mx-auto flex items-center justify-center font-bold text-2xl mb-5 shadow-lg ${classeIcone}">
                            <i class="fa-solid ${icone}"></i>
                        </div>
                        <h2 class="titulo-secao texto-forte mb-2">${escaparHtml(titulo)}</h2>
                        ${subtitulo ? `<p class="text-sm texto-padrao font-medium">${escaparHtml(subtitulo)}</p>` : ''}
                    </div>
                    <div class="p-6 sm:p-10 space-y-6">${conteudoHtml}</div>
                    ${rodapeHtml ? `<div class="p-6 border-t borda-padrao fundo-cartao rounded-b-2xl">${rodapeHtml}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

export function htmlFichaConsulta({ titulo, subtitulo, badgesHtml, acaoTopoHtml, conteudoHtml, acoesHtml }) {
  return `
        <div class="min-h-[calc(100vh-4rem)] flex items-start justify-center p-4 sm:p-8 fundo-pagina">
            <div class="w-full fundo-cartao rounded-xl shadow-lg border borda-padrao max-w-2xl">
                <div class="px-8 py-6 border-b borda-padrao fundo-sutil rounded-t-xl flex items-start justify-between gap-4 flex-wrap">
                    <div class="min-w-0">
                        <h2 class="titulo-secao texto-forte truncate">${escaparHtml(titulo)}</h2>
                        ${subtitulo ? `<p class="text-sm texto-fraco mt-1 break-words">${escaparHtml(subtitulo)}</p>` : ''}
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        ${badgesHtml ? `<div class="flex flex-wrap gap-1.5 justify-end">${badgesHtml}</div>` : ''}
                        ${acaoTopoHtml || ''}
                    </div>
                </div>
                <div class="px-8 py-6 space-y-6">${conteudoHtml}</div>
                ${acoesHtml ? `<div class="px-8 py-5 border-t borda-padrao fundo-cartao rounded-b-xl">${acoesHtml}</div>` : ''}
            </div>
        </div>
    `;
}

export function htmlSecaoFicha({ titulo, camposHtml, colunas = 2 }) {
  return `
        <div>
            <h3 class="rotulo mb-3 pb-2 border-b borda-padrao">${escaparHtml(titulo)}</h3>
            <div class="grid gap-x-6 gap-y-4 ${colunas === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}">${camposHtml}</div>
        </div>
    `;
}

export function htmlCampoFicha({ rotulo, valor, larguraCheia = false }) {
  const temValor = valor !== null && valor !== undefined && valor !== '';
  return `
        <div class="${larguraCheia ? 'sm:col-span-2' : ''}">
            <div class="rotulo mb-1">${escaparHtml(rotulo)}</div>
            <span class="text-sm min-w-0 break-words block ${temValor ? 'font-medium texto-forte' : 'texto-fraco opacity-50'}">${temValor ? escaparHtml(valor) : '-'}</span>
        </div>
    `;
}
