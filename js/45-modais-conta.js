// Perfil da conta, troca de senha, selo de e-mail e comentário em campanha, em JavaScript puro.
// Baseado em perfil-conta-publica, modal-alterar-senha, selo-status-conta e modal-comentar-campanha da Alexia (branch main),
// reescritos sem React sobre js/44-interface-modal.js.
import { escaparHtml } from './1-utilitarios.js';
import {
  abrirModalFicha, htmlCampo, htmlSelect, htmlSecaoFicha, htmlCampoFicha, htmlRodapeAcoes, htmlMensagemErro, mostrarErro,
} from './44-interface-modal.js';

// ---------- Selo de e-mail verificado ----------
export function htmlSeloStatusConta(emailVerificado) {
  const rotulo = emailVerificado ? 'E-mail verificado' : 'E-mail não verificado';
  return `<span class="badge flex items-center gap-1 ${emailVerificado ? 'badge-sucesso' : 'fundo-aviso texto-aviso'}" aria-label="${rotulo}">
    <i class="fa-solid text-microrrotulo ${emailVerificado ? 'fa-check' : 'fa-triangle-exclamation'}" aria-hidden="true"></i>${rotulo}</span>`;
}

// ---------- Alterar senha ----------
export function montarAlterarSenha(host, { aoSalvar }) {
  host.innerHTML = '<button type="button" class="btn btn-secondary" data-abrir>Alterar senha</button>';
  host.querySelector('[data-abrir]').addEventListener('click', () => {
    abrirModalFicha({
      titulo: 'Alterar senha',
      subtitulo: 'Escolha uma senha exclusiva com pelo menos oito caracteres.',
      corpoHtml: `
        <form id="form-alterar-senha-publica" class="space-y-4" novalidate>
          ${htmlCampo({ rotulo: 'Senha atual', controle: (a) => `<input ${a} name="atual" type="password" autocomplete="current-password" required class="input-padrao">` })}
          ${htmlCampo({ rotulo: 'Nova senha', dica: 'Use pelo menos oito caracteres.', controle: (a) => `<input ${a} name="nova" type="password" autocomplete="new-password" minlength="8" required class="input-padrao">` })}
          ${htmlCampo({ rotulo: 'Confirmar nova senha', controle: (a) => `<input ${a} name="confirmacao" type="password" autocomplete="new-password" minlength="8" required class="input-padrao">` })}
          ${htmlMensagemErro()}
        </form>`,
      rodapeHtml: htmlRodapeAcoes({ formulario: 'form-alterar-senha-publica', rotuloAcao: 'Salvar nova senha' }),
      aoMontar(modal) {
        const form = modal.janela.querySelector('form');
        form.addEventListener('submit', (evento) => {
          evento.preventDefault();
          const d = new FormData(form);
          if (!d.get('atual') || String(d.get('nova')).length < 8 || d.get('nova') !== d.get('confirmacao')) {
            mostrarErro(modal.janela, 'Informe a senha atual e uma nova senha de pelo menos oito caracteres que corresponda à confirmação.');
            return;
          }
          aoSalvar();
          modal.fechar();
        });
      },
    });
  });
}

// ---------- Perfil da conta (leitura + modal de edição) ----------
const TITULOS = ['Graduado', 'Especialista', 'Mestre', 'Doutor'];

export function montarPerfilConta(host, { dados, aoSalvar }) {
  const p = dados.pesquisador;
  host.innerHTML = `
    <div class="space-y-6">
      <section class="rounded-xl border borda-padrao fundo-cartao p-5 sm:p-6">
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="subtitulo texto-forte">Dados pessoais</h2>
            <p class="mt-1 text-sm texto-fraco">Informações da sua conta pública.</p>
          </div>
          <button type="button" class="btn btn-secondary" data-editar-perfil><i class="fa-solid fa-pen mr-2" aria-hidden="true"></i>Editar perfil</button>
        </div>
        ${htmlSecaoFicha('Conta', [
          htmlCampoFicha('Nome de exibição', dados.nome),
          htmlCampoFicha('E-mail', dados.email),
          htmlCampoFicha('Membro desde', dados.membroDesde),
          htmlCampoFicha('Foto de perfil', dados.foto ? 'Foto personalizada' : 'Avatar padrão'),
        ].join(''))}
      </section>
      ${p ? `
      <section class="rounded-xl border borda-padrao fundo-cartao p-5 sm:p-6">
        <div class="mb-5">
          <h2 class="subtitulo texto-forte">Dados do perfil acadêmico</h2>
          <p class="mt-1 text-sm texto-fraco">Dados acadêmicos e de recebimento das suas campanhas.</p>
        </div>
        <div class="space-y-6">
          ${htmlSecaoFicha('Identificação acadêmica', [
            htmlCampoFicha('CPF cadastrado', p.cpfMascarado),
            htmlCampoFicha('Título acadêmico', p.tituloAcademico),
            htmlCampoFicha('Tipo de vínculo', p.tipoVinculo),
            htmlCampoFicha('Instituição', p.instituicao),
            htmlCampoFicha('Status do perfil', p.statusPesquisador),
            htmlCampoFicha('Score atual', p.scoreAtual),
          ].join(''))}
          ${htmlSecaoFicha('Recebimento por Pix', [
            htmlCampoFicha('Chave cadastrada', `${p.tipoChavePix} · ${p.chavePixMascarada}`),
            htmlCampoFicha('Proteção', 'A chave completa não é exibida nesta página.'),
          ].join(''))}
        </div>
      </section>` : ''}
    </div>`;

  host.querySelector('[data-editar-perfil]').addEventListener('click', () => abrirEdicao());

  function abrirEdicao() {
    let foto = dados.foto;
    abrirModalFicha({
      titulo: 'Editar perfil',
      subtitulo: 'Altere somente os dados que podem ser atualizados por você.',
      corpoHtml: `
        <form id="form-editar-perfil-publico" class="space-y-6" novalidate>
          ${htmlSecaoFicha('Dados pessoais', `
            ${htmlCampo({ rotulo: 'Nome de exibição', controle: (a) => `<input ${a} name="nome" required minlength="2" value="${escaparHtml(dados.nome)}" class="input-padrao">` })}
            ${htmlCampo({ rotulo: 'Nova foto de perfil', dica: 'Imagem de até 2 MB.', controle: (a) => `<input ${a} name="foto" type="file" accept="image/*" class="input-padrao">` })}
            <p role="alert" class="erro-campo" data-erro-foto hidden></p>`)}
          ${p ? `
            ${htmlSecaoFicha('Dados do perfil acadêmico', `
              ${htmlSelect({ rotulo: 'Título acadêmico', nome: 'titulo', valor: p.tituloAcademico || 'Graduado', opcoes: TITULOS.map((t) => ({ valor: t, rotulo: t })) })}
              ${htmlSelect({ rotulo: 'Tipo de vínculo', nome: 'vinculo', valor: p.tipoVinculo || 'institucional', opcoes: [{ valor: 'institucional', rotulo: 'Institucional' }, { valor: 'independente', rotulo: 'Independente' }] })}
              <div data-campo-instituicao>${htmlCampo({ rotulo: 'Instituição', controle: (a) => `<input ${a} name="instituicao" value="${escaparHtml(p.instituicao || '')}" class="input-padrao">` })}</div>`)}
            ${htmlSecaoFicha('Recebimento por Pix', htmlCampo({ rotulo: 'Nova chave Pix', dica: 'Deixe vazio para manter a chave atual. A chave completa não será salva neste protótipo.', controle: (a) => `<input ${a} name="pix" autocomplete="off" class="input-padrao">` }), { colunas: 1 })}
          ` : ''}
          ${htmlMensagemErro()}
        </form>`,
      rodapeHtml: htmlRodapeAcoes({ formulario: 'form-editar-perfil-publico', rotuloAcao: 'Salvar alterações' }),
      aoMontar(modal) {
        const form = modal.janela.querySelector('form');
        const erroFoto = modal.janela.querySelector('[data-erro-foto]');
        const vinculo = form.elements.vinculo;
        const alternarInstituicao = () => {
          const alvo = form.querySelector('[data-campo-instituicao]');
          if (alvo && vinculo) alvo.hidden = vinculo.value !== 'institucional';
        };
        vinculo?.addEventListener('change', alternarInstituicao);
        alternarInstituicao();

        form.elements.foto.addEventListener('change', (evento) => {
          erroFoto.hidden = true;
          const arquivo = evento.target.files?.[0];
          if (!arquivo) return;
          if (!arquivo.type.startsWith('image/') || arquivo.size > 2 * 1024 * 1024) {
            erroFoto.textContent = 'Escolha uma imagem de até 2 MB.';
            erroFoto.hidden = false;
            evento.target.value = '';
            return;
          }
          const leitor = new FileReader();
          leitor.addEventListener('load', () => { if (typeof leitor.result === 'string') foto = leitor.result; });
          leitor.addEventListener('error', () => { erroFoto.textContent = 'Não foi possível ler o arquivo de imagem.'; erroFoto.hidden = false; });
          leitor.readAsDataURL(arquivo);
        });

        form.addEventListener('submit', (evento) => {
          evento.preventDefault();
          const d = new FormData(form);
          const nome = String(d.get('nome') || '').trim();
          if (nome.length < 2) { mostrarErro(modal.janela, 'Informe um nome de exibição com pelo menos 2 caracteres.'); return; }
          const resultado = { nome, foto };
          if (p) {
            const pix = String(d.get('pix') || '').trim();
            const institucional = d.get('vinculo') === 'institucional';
            resultado.pesquisador = {
              tituloAcademico: String(d.get('titulo')),
              tipoVinculo: String(d.get('vinculo')),
              instituicao: institucional ? String(d.get('instituicao') || '').trim() : '',
              chavePixMascarada: pix ? `${'*'.repeat(Math.max(4, Math.min(pix.length - 4, 10)))}${pix.slice(-4)}` : p.chavePixMascarada,
              tipoChavePix: pix ? (pix.includes('@') ? 'E-mail' : /^\d+$/.test(pix) ? 'CPF/telefone' : 'Chave Pix') : p.tipoChavePix,
            };
          }
          modal.fechar();
          aoSalvar(resultado);
        });
      },
    });
  }
}

// ---------- Comentários da comunidade em uma campanha ----------
export function montarComentariosCampanha(host, { campanha, comentarios, podeComentar, aoEnviar }) {
  const daCampanha = comentarios.filter((c) => c.campanha === campanha);
  host.innerHTML = `
    <section class="mt-8 rounded-xl border borda-padrao fundo-cartao p-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="subtitulo texto-forte">Comentários da comunidade</h2>
          <p class="mt-1 text-sm texto-fraco">Comentários ficam públicos depois do endosso do pesquisador responsável.</p>
        </div>
        ${podeComentar
          ? '<button type="button" class="btn btn-primary" data-comentar>Comentar nesta campanha</button>'
          : '<p class="text-sm texto-fraco">O comentário nesta campanha está disponível para pesquisadores cadastrados.</p>'}
      </div>
      <ul class="mt-5 space-y-3">
        ${daCampanha.map((c) => `
          <li class="rounded-lg border borda-padrao p-4">
            <p class="text-sm texto-padrao">${escaparHtml(c.texto)}</p>
            <span class="mt-2 inline-flex badge badge-aviso">${escaparHtml(c.estado)}</span>
          </li>`).join('') || '<li class="text-sm texto-fraco">Ainda não há comentários nesta campanha.</li>'}
      </ul>
    </section>`;

  host.querySelector('[data-comentar]')?.addEventListener('click', () => {
    abrirModalFicha({
      titulo: 'Comentar nesta campanha',
      subtitulo: campanha,
      corpoHtml: `
        <form id="form-comentar-campanha-publica" class="space-y-4" novalidate>
          ${htmlCampo({ rotulo: 'Seu comentário', dica: 'O comentário ficará pendente até o endosso do pesquisador responsável.', controle: (a) => `<textarea ${a} name="texto" rows="5" maxlength="1000" required class="input-padrao" placeholder="Escreva seu comentário"></textarea>` })}
          ${htmlMensagemErro()}
        </form>`,
      rodapeHtml: htmlRodapeAcoes({ formulario: 'form-comentar-campanha-publica', rotuloAcao: 'Enviar comentário' }),
      aoMontar(modal) {
        const form = modal.janela.querySelector('form');
        form.addEventListener('submit', (evento) => {
          evento.preventDefault();
          const texto = String(new FormData(form).get('texto') || '').trim();
          if (!texto) { mostrarErro(modal.janela, 'Escreva um comentário antes de enviar.'); return; }
          modal.fechar();
          aoEnviar(texto);
        });
      },
    });
  });
}
