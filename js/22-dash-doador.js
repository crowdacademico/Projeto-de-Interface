import { renderMenuLateralPainel, escaparHtml, TONS_STATUS } from './1-utilitarios.js';
import { htmlEscalaProgresso } from './1-utilitarios.js';
import { donorMetrics, donorNovidades, donorFollowedCampaigns, donorContributions, donorSidebarItems } from '../dados-falsos/9-dash-doador.js';

export function renderDonorDashboard() {

    renderMenuLateralPainel('donor-sidebar-nav', donorSidebarItems);
    const metrics = document.getElementById('donor-metrics');
    const novidades = document.getElementById('donor-novidades');
    const followed = document.getElementById('donor-followed-campaigns');
    const contributions = document.getElementById('donor-contributions');
    if (metrics) {
        metrics.innerHTML = donorMetrics.map(metric => `
            <div class="rounded-xl border borda-padrao fundo-cartao p-4 shadow-sm">
                <div class="numero text-2xl font-black ${metric.accent}">${escaparHtml(metric.value)}</div>
                <div class="rotulo mt-1">${escaparHtml(metric.label)}</div>
            </div>
        `).join('');
    }

    if (novidades) {
        novidades.innerHTML = donorNovidades.slice(0, 3).map((n) => `
            <div class="border-l-4 border-primary pl-4">
                <p class="microrrotulo texto-fraco mb-1">${escaparHtml(n.projeto)} · ${escaparHtml(n.data)}</p>
                <p class="font-bold texto-forte">${escaparHtml(n.titulo)}</p>
                <p class="text-sm texto-padrao mt-1">${escaparHtml(n.corpo)}</p>
            </div>
        `).join('');
    }
    if (followed) {
        followed.innerHTML = donorFollowedCampaigns.map(item => `
            <div class="rounded-xl border borda-padrao fundo-cartao p-4 shadow-sm">
                <div class="flex items-center justify-between gap-3 mb-3">
                    <div class="font-bold texto-forte">${escaparHtml(item.title)}</div>
                    <span class="inline-flex items-center rounded-full px-3 py-1 microrrotulo ${item.accent} shrink-0">${escaparHtml(item.meta)}</span>
                </div>
                ${htmlEscalaProgresso({ percentual: item.percentual, valorAtual: item.valorAtual, valorMeta: item.valorMeta, modelo: item.modelo, compacta: true })}
                <a href="#" onclick="nav('atualizacoes'); return false;" class="text-xs font-bold texto-marca hover:underline mt-3 inline-block">Ver atualizações</a>
            </div>
        `).join('');
    }
    if (contributions) {
        contributions.innerHTML = donorContributions.map(item => `
            <tr class="hover-fundo-sutil transition-colors">
                <td class="px-8 py-5 font-mono text-xs texto-fraco">${escaparHtml(item.date)}</td>
                <td class="px-8 py-5 font-bold texto-padrao">${escaparHtml(item.project)}</td>
                <td class="px-8 py-5 font-semibold texto-forte numero text-right">${escaparHtml(item.value)}</td>
                <td class="px-8 py-5 texto-padrao">${escaparHtml(item.payment)}</td>
                <td class="px-8 py-5"><span class="status-pill ${TONS_STATUS[item.statusTone]}">${escaparHtml(item.status)}</span></td>
                <td class="px-8 py-5 text-right whitespace-nowrap">
                    <button type="button" onclick="mostrarAcao('Recibo simulado no protótipo.')" class="text-xs font-bold texto-fraco hover-texto-forte transition-colors mr-3">Recibo</button>
                    <button type="button" onclick="nav('campanha')" class="text-xs font-bold texto-marca hover:underline">Ver projeto</button>
                </td>
            </tr>
        `).join('');
    }
}
