import { htmlAvatar, escaparHtml } from './1-utilitarios.js';
import { usuarioAtual, temPapel } from './4-autenticacao-falsa.js';
import { atualizarIconeTema } from './3-tema.js';

export function atualizarCabecalhoConta() {
  renderMenuConta();
  atualizarIconeTema();
}

function renderMenuConta() {
  const container = document.getElementById('menu-conta-container');
  if (!container) return;
  const usuario = usuarioAtual();

  container.innerHTML = `
        <div class="relative">
            <button type="button" onclick="alternarMenuConta()" aria-label="Menu da conta" class="flex items-center gap-1.5 hover-fundo-sutil rounded-full p-0.5 transition-colors">
                ${usuario ? htmlAvatar(usuario.nome) : '<div class="w-9 h-9 rounded-full fundo-sutil border borda-padrao flex items-center justify-center texto-fraco"><i class="fa-solid fa-user"></i></div>'}
                <i class="fa-solid fa-chevron-down text-xs texto-fraco"></i>
            </button>
            <div id="dropdown-menu-conta" class="hidden absolute right-0 mt-2 w-64 fundo-elevado rounded-xl shadow-2xl border borda-forte overflow-hidden z-50">
                ${usuario ? htmlDropdownLogado(usuario) : htmlDropdownDeslogado()}
            </div>
        </div>
    `;
}

function htmlDropdownLogado(usuario) {
  const ehPesquisador = temPapel('pesquisador');
  return `
        <div class="px-4 py-3 border-b borda-padrao fundo-sutil">
            <p class="text-sm font-bold texto-forte truncate">${escaparHtml(usuario.nome)}</p>
            <p class="text-xs texto-fraco truncate">${escaparHtml(usuario.email)}</p>
        </div>
        <button type="button" onclick="fecharMenuConta(); nav('dash-doador');" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold texto-padrao hover-fundo-sutil transition-colors text-left">
            <i class="fa-solid fa-heart w-4"></i> Seus Apoios
        </button>
        ${ehPesquisador ? `
            <button type="button" onclick="fecharMenuConta(); nav('dash-pesquisador');" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold texto-padrao hover-fundo-sutil transition-colors text-left">
                <i class="fa-solid fa-graduation-cap w-4"></i> Seu Estúdio
            </button>
        ` : `
            <button type="button" onclick="fecharMenuConta(); mostrarAcao('Complete seu cadastro de Pesquisador pra acessar o Estúdio (peça o upgrade em Seus Apoios).');" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold texto-fraco hover-fundo-sutil transition-colors text-left">
                <i class="fa-solid fa-lock w-4"></i> Seu Estúdio
            </button>
        `}
        <div class="border-t borda-padrao"></div>
        <button type="button" onclick="fecharMenuConta(); nav('minha-conta');" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold texto-padrao hover-fundo-sutil transition-colors text-left">
            <i class="fa-solid fa-user w-4"></i> Minha Conta
        </button>
        <button type="button" onclick="fecharMenuConta(); nav('notificacoes');" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold texto-padrao hover-fundo-sutil transition-colors text-left">
            <i class="fa-solid fa-bell w-4"></i> Notificações
        </button>
        <div class="border-t borda-padrao"></div>
        <button type="button" onclick="fecharMenuConta(); sair(); atualizarCabecalhoConta(); renderizarTelaMinhaConta(); nav('home');" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold texto-erro hover-fundo-sutil transition-colors text-left">
            <i class="fa-solid fa-right-from-bracket w-4"></i> Sair da Conta
        </button>
    `;
}

function htmlDropdownDeslogado() {
  return `
        <button type="button" onclick="fecharMenuConta(); nav('login');" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold texto-padrao hover-fundo-sutil transition-colors text-left">
            <i class="fa-solid fa-right-to-bracket w-4"></i> Entrar
        </button>
        <button type="button" onclick="fecharMenuConta(); nav('login');" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-primary hover-fundo-sutil transition-colors text-left">
            <i class="fa-solid fa-user-plus w-4"></i> Cadastre-se
        </button>
    `;
}

export function alternarMenuConta() {
  document.getElementById('dropdown-menu-conta').classList.toggle('hidden');
}
export function fecharMenuConta() {
  document.getElementById('dropdown-menu-conta').classList.add('hidden');
}
document.addEventListener('mousedown', (evento) => {
  const dropdown = document.getElementById('dropdown-menu-conta');
  const container = document.getElementById('menu-conta-container');
  if (dropdown && container && !container.contains(evento.target)) {
    dropdown.classList.add('hidden');
  }
});
