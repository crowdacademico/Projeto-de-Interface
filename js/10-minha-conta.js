import { usuarioAtual } from './4-autenticacao-falsa.js';
import { papeisDoUsuario } from '../dados-falsos/1-usuarios.js';
import { htmlAvatar, escaparHtml, escaparAtributo, formatarData, formatarDataHora, mostrarAcao, htmlMigalhas } from './1-utilitarios.js';
import { htmlSecaoFicha, htmlCampoFicha } from './6-formulario.js';
import { atualizarCabecalhoConta } from './7-cabecalho.js';

export function renderizarTelaMinhaConta() {
  const faixa = document.getElementById('faixa-identidade-minha-conta');
  if (!faixa) return;

  const migalhas = document.getElementById('migalhas-minha-conta');
  if (migalhas) migalhas.innerHTML = htmlMigalhas([{ rotulo: 'Minha Conta' }]);

  const secoes = document.getElementById('secoes-minha-conta');
  const usuario = usuarioAtual();
  if (!usuario) {
    faixa.innerHTML = '';
    secoes.innerHTML = '<p class="p-10 text-center texto-fraco">Você precisa estar logado.</p>';
    return;
  }

  faixa.innerHTML = htmlFaixaIdentidade(usuario);
  secoes.innerHTML = [
    htmlSecaoPerfil(usuario),
    htmlSecaoSeguranca(usuario),
    htmlSecaoPapeis(usuario),
    htmlSecaoAcademico(usuario),
    htmlSecaoPrivacidade(),
  ].join('');

  document.getElementById('form-minha-conta-perfil').addEventListener('submit', (evento) => {
    evento.preventDefault();
    usuario.nome = document.getElementById('minha-conta-nome').value.trim();
    mostrarAcao('Perfil atualizado com sucesso.');
    atualizarCabecalhoConta();
    renderizarTelaMinhaConta();
  });
}

function htmlFaixaIdentidade(usuario) {
  const papeis = papeisDoUsuario(usuario);
  const membroDesde = usuario.criadoEm
    ? new Date(usuario.criadoEm).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })
    : null;

  return `
        <div class="relative overflow-hidden rounded-t-xl border-b borda-padrao fundo-sutil px-6 sm:px-8 py-8">
            <div class="mancha-identidade" aria-hidden="true"></div>
            <div class="relative flex flex-col sm:flex-row sm:items-center gap-5">
                <div class="p-1 rounded-full fundo-cartao shadow-md shrink-0 w-fit">
                    ${htmlAvatar(usuario.nome, { tamanho: 'xxl' })}
                </div>
                <div class="min-w-0 flex-1">
                    <span class="cabecalho-catalogo__rotulo">Ficha de conta</span>
                    <h1 class="titulo-pagina texto-forte break-words">${escaparHtml(usuario.nome)}</h1>
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-sm texto-fraco">
                        <span class="break-words">${escaparHtml(usuario.email)}</span>
                        <span class="badge flex items-center gap-1 ${usuario.emailVerificado ? 'badge-sucesso' : 'fundo-aviso texto-aviso'}">
                            <i class="fa-solid text-microrrotulo ${usuario.emailVerificado ? 'fa-check' : 'fa-triangle-exclamation'}"></i>
                            ${usuario.emailVerificado ? 'E-mail verificado' : 'E-mail não verificado'}
                        </span>
                        ${membroDesde ? `<span class="paragrafo-denso">Membro desde ${membroDesde}</span>` : ''}
                    </div>
                    ${papeis.length > 0 ? `<div class="flex flex-wrap gap-1.5 mt-3">${papeis.map((p) => `<span class="badge badge-neutro">${escaparHtml(p.nome)}</span>`).join('')}</div>` : ''}
                </div>
            </div>
        </div>
    `;
}

function htmlSecaoPerfil(usuario) {

  return `
        <form id="form-minha-conta-perfil" class="px-6 sm:px-8 py-8">
            <h2 class="subtitulo texto-forte mb-6">Perfil</h2>
            <div class="space-y-6">
                ${htmlSecaoFicha({
                  titulo: 'Foto do perfil',
                  camposHtml: `
                        <div class="sm:col-span-2 flex items-center gap-4">
                            ${htmlAvatar(usuario.nome, { tamanho: 'lg' })}
                            <div>
                                <button type="button" disabled class="btn btn-secondary opacity-60 cursor-not-allowed"><i class="fa-solid fa-camera"></i> Alterar foto</button>
                                <p class="text-xs texto-fraco mt-2">Upload de foto ainda não foi implementado neste protótipo.</p>
                            </div>
                        </div>
                    `,
                })}
                ${htmlSecaoFicha({
                  titulo: 'Dados da conta',
                  camposHtml: `
                        <div><label class="rotulo-campo" for="minha-conta-nome">Nome</label><input type="text" id="minha-conta-nome" value="${escaparAtributo(usuario.nome)}" class="input-padrao" /></div>
                        <div><label class="rotulo-campo" for="minha-conta-email">E-mail</label><input type="email" id="minha-conta-email" value="${escaparAtributo(usuario.email)}" disabled class="input-padrao" /></div>
                    `,
                })}
            </div>
            <div class="flex gap-3 justify-end mt-8">
                <button type="button" onclick="renderizarTelaMinhaConta()" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
        </form>
    `;
}

function htmlSecaoSeguranca(usuario) {
  return `
        <div class="px-6 sm:px-8 py-8 space-y-8">
            <h2 class="subtitulo texto-forte">Segurança</h2>
            <div>
                <h3 class="rotulo mb-3 pb-2 border-b borda-padrao">Trocar senha</h3>
                <form onsubmit="event.preventDefault(); mostrarAcao('Senha alterada com sucesso.');" class="space-y-4 max-w-md">
                    <div><label class="rotulo-campo" for="minha-conta-senha-atual">Senha atual</label><input type="password" id="minha-conta-senha-atual" class="input-padrao" /></div>
                    <div><label class="rotulo-campo" for="minha-conta-senha-nova">Nova senha</label><input type="password" id="minha-conta-senha-nova" class="input-padrao" /></div>
                    <button type="submit" class="btn btn-secondary">Alterar senha</button>
                </form>
            </div>
            <div>
                <h3 class="rotulo mb-3 pb-2 border-b borda-padrao">Sessões ativas (2)</h3>
                <ul class="space-y-2">
                    <li class="flex items-center gap-3 rounded-lg border borda-padrao p-3 text-sm sessao-registro sessao-registro--ativa">
                        <i class="fa-solid fa-desktop texto-fraco text-lg shrink-0"></i>
                        <div class="min-w-0 flex-1">
                            <p class="texto-forte truncate flex items-center gap-2">Windows · Chrome <span class="badge badge-sucesso shrink-0">Esta sessão</span></p>
                            <p class="paragrafo-denso">desde ${formatarDataHora(usuario.ultimoLoginEm || new Date())}</p>
                        </div>
                    </li>
                    <li class="flex items-center gap-3 rounded-lg border borda-padrao p-3 text-sm sessao-registro">
                        <i class="fa-solid fa-mobile-screen-button texto-fraco text-lg shrink-0"></i>
                        <div class="min-w-0 flex-1">
                            <p class="texto-forte truncate">Android · App</p>
                            <p class="paragrafo-denso">desde ${formatarData('2026-08-10')}</p>
                        </div>
                        <button type="button" onclick="mostrarAcao('Sessão encerrada.')" aria-label="Encerrar esta sessão" class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center texto-erro hover-fundo-sutil transition-colors"><i class="fa-solid fa-power-off text-sm"></i></button>
                    </li>
                </ul>
            </div>
        </div>
    `;
}

function htmlSecaoPapeis(usuario) {
  const papeis = papeisDoUsuario(usuario);
  return `
        <div class="px-6 sm:px-8 py-8">
            <h2 class="subtitulo texto-forte mb-4">Papéis</h2>
            <p class="text-sm texto-fraco mb-4">O que você é na plataforma, só leitura aqui. Para alterar, um administrador precisa fazer isso pelo painel de Usuários.</p>
            <div class="flex flex-wrap gap-2">${papeis.map((p) => `<span class="badge badge-neutro">${escaparHtml(p.nome)}</span>`).join('') || '<p class="text-sm texto-fraco">Nenhum papel atribuído.</p>'}</div>
        </div>
    `;
}

function htmlSecaoAcademico(usuario) {
  const perfil = usuario.perfilPesquisador;
  return `
        <div class="px-6 sm:px-8 py-8 space-y-6">
            <h2 class="subtitulo texto-forte">Acadêmico</h2>
            <div class="flex items-start gap-2 rounded-lg fundo-info texto-info p-3 text-xs">
                <i class="fa-solid fa-circle-info mt-0.5 shrink-0"></i>
                <p>Módulo de Perfil de Pesquisador ainda não foi implementado no sistema principal. Os campos abaixo são demonstrativos.</p>
            </div>
            ${htmlSecaoFicha({
              titulo: 'Vínculo institucional',
              camposHtml:
                htmlCampoFicha({ rotulo: 'Instituição', valor: perfil?.instituicao }) +
                htmlCampoFicha({ rotulo: 'Título acadêmico', valor: perfil?.tituloAcademico }) +
                htmlCampoFicha({ rotulo: 'Área de conhecimento', valor: perfil?.areaConhecimento }) +
                htmlCampoFicha({ rotulo: 'Score atual', valor: perfil?.scoreAtual }),
            })}
        </div>
    `;
}

function htmlSecaoPrivacidade() {
  return `
        <div class="px-6 sm:px-8 py-8 space-y-6">
            <h2 class="subtitulo texto-forte">Privacidade</h2>
            <div class="flex items-center justify-between gap-3 rounded-lg border borda-padrao p-4">
                <div>
                    <p class="text-sm font-semibold texto-padrao">Exportar meus dados</p>
                    <p class="text-xs texto-fraco">Direito de portabilidade (LGPD Art. 18), ainda não implementado neste protótipo.</p>
                </div>
                <button type="button" disabled class="btn btn-secondary opacity-50 cursor-not-allowed">Exportar</button>
            </div>
            <div class="rounded-lg border borda-forte fundo-erro p-4">
                <p class="text-sm font-bold texto-erro mb-2">Excluir minha conta</p>
                <p class="text-xs texto-erro mb-3">Marca sua conta como excluída, o login para de funcionar na hora. Não existe desfazer.</p>
                <button type="button" onclick="mostrarAcao('Exclusão de conta simulada. Em um sistema de verdade, isto pediria confirmação por e-mail.')" class="btn btn-danger">Excluir minha conta</button>
            </div>
        </div>
    `;
}
