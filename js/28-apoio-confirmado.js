import { escaparHtml } from './1-utilitarios.js';

let ultimaContribuicao = {
  projeto: 'Microplásticos no Rio Paraná',
  valor: 'R$ 150,00',
  protocolo: '2026-08-0000',
  meio: 'PIX',
  progressoAntes: 65,
  progressoDepois: 65,
};

export function definirUltimaContribuicao(dados) {
  ultimaContribuicao = { ...ultimaContribuicao, ...dados };
}

export function renderizarApoioConfirmado() {
  const container = document.getElementById('view-apoio-confirmado-conteudo');
  if (!container) return;
  const c = ultimaContribuicao;
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  container.innerHTML = `
    <div class="max-w-xl mx-auto px-4 py-16">
      <div class="cartao cartao--grande text-center">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full fundo-sucesso flex items-center justify-center" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="var(--cor-texto-sucesso)" stroke-width="2.5"
              stroke-dasharray="113" stroke-dashoffset="113" style="animation: marca-confirmacao-circulo 500ms ease-out forwards;" />
            <path d="M12 20.5L17 25.5L28 14.5" stroke="var(--cor-texto-sucesso)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
              stroke-dasharray="24" stroke-dashoffset="24" style="animation: marca-confirmacao-check 300ms ease-out 450ms forwards;" />
          </svg>
        </div>

        <h1 class="titulo-secao mb-2">Contribuição registrada</h1>
        <p class="paragrafo texto-padrao mb-1">Sua contribuição de <strong class="texto-forte">${escaparHtml(c.valor)}</strong> foi registrada.</p>
        <p class="legenda mb-8">Protocolo <span class="font-dado">${escaparHtml(c.protocolo)}</span></p>

        <div class="text-left rounded-xl border borda-padrao overflow-hidden mb-6">
          <div class="fundo-sutil px-5 py-3 border-b borda-padrao">
            <span class="rotulo">Resumo</span>
          </div>
          <div class="p-5 space-y-3 text-sm">
            <div class="flex justify-between gap-4"><span class="texto-fraco">Projeto</span><span class="font-bold texto-forte text-right">${escaparHtml(c.projeto)}</span></div>
            <div class="flex justify-between gap-4"><span class="texto-fraco">Valor</span><span class="numero font-bold texto-forte">${escaparHtml(c.valor)}</span></div>
            <div class="flex justify-between gap-4"><span class="texto-fraco">Meio de pagamento</span><span class="texto-padrao">${escaparHtml(c.meio)}</span></div>
            <div class="flex justify-between gap-4"><span class="texto-fraco">Data</span><span class="texto-padrao">${escaparHtml(dataHoje)}</span></div>
          </div>
        </div>

        <div class="text-left rounded-xl border borda-padrao p-5 mb-8">
          <p class="rotulo mb-3">Com o seu apoio</p>
          <div class="flex items-center justify-between mb-2 text-sm font-bold">
            <span class="texto-fraco">${c.progressoAntes.toFixed(1)}%</span>
            <i class="fa-solid fa-arrow-right texto-fraco text-xs"></i>
            <span class="texto-sucesso">${c.progressoDepois.toFixed(1)}% da meta</span>
          </div>
          <div class="w-full fundo-realce rounded-full h-2.5 overflow-hidden" role="progressbar"
               aria-valuenow="${c.progressoDepois.toFixed(1)}" aria-valuemin="0" aria-valuemax="100"
               aria-label="${c.progressoDepois.toFixed(1)}% da meta arrecadada, atualizado com sua contribuição">
            <div class="bg-primary h-full rounded-full" style="width: ${c.progressoDepois}%"></div>
          </div>
        </div>

        <div class="text-left rounded-xl fundo-info p-5 mb-8">
          <p class="rotulo texto-info mb-3">O que acontece agora</p>
          <ol class="space-y-2 text-sm texto-padrao">
            <li class="flex gap-2"><span class="font-bold texto-info">1.</span> O pesquisador é notificado do seu apoio.</li>
            <li class="flex gap-2"><span class="font-bold texto-info">2.</span> Se a meta for atingida, o valor é repassado ao projeto.</li>
            <li class="flex gap-2"><span class="font-bold texto-info">3.</span> Você recebe atualizações do andamento por e-mail.</li>
          </ol>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button type="button" onclick="mostrarAcao('Recibo simulado. Em um sistema de verdade, isto baixaria um PDF.')" class="btn btn-secondary justify-center"><i class="fa-solid fa-file-arrow-down"></i> Recibo</button>
          <button type="button" onclick="nav('campanha')" class="btn btn-secondary justify-center"><i class="fa-solid fa-arrow-trend-up"></i> Acompanhar</button>
          <button type="button" onclick="nav('explorar')" class="btn btn-primary justify-center"><i class="fa-solid fa-compass"></i> Explorar outros</button>
        </div>
      </div>
    </div>
  `;
}
