import { escaparHtml, mostrarAcao } from './1-utilitarios.js';
import { TIPOS_CONTA, REQUISITOS_SENHA, RESULTADO_LATTES_SIMULADO } from '../dados-falsos/19-cadastro.js';

const estado = {
  passo: 1,
  tipoConta: null,
  nome: '',
  email: '',
  cpf: '',
  senha: '',
  lattesId: '',
  lattesValidando: false,
  lattesResultado: null,
  aceite: false,
  concluido: false,
};

function totalPassos() {
  return estado.tipoConta === 'pesquisador' ? 3 : 2;
}

function mascararCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function senhaValida() {
  return REQUISITOS_SENHA.every((req) => req.teste(estado.senha));
}

function passo2Valido() {
  return estado.nome.trim().length > 2 && /\S+@\S+\.\S+/.test(estado.email) && estado.cpf.length === 14 && senhaValida();
}

function renderizarIndicadorPassos() {
  const container = document.getElementById('cadastro-indicador-passos');
  if (!container) return;
  const total = totalPassos();
  container.innerHTML = Array.from({ length: total }, (_, i) => i + 1).map((n) => `
    <div class="flex-1 h-1.5 rounded-full ${n <= estado.passo ? '' : 'fundo-sutil'}" style="${n <= estado.passo ? 'background-color: var(--cor-marca);' : ''}"></div>
  `).join('');
}

function htmlPasso1() {
  return `
    <div class="grid grid-cols-1 gap-4">
      ${TIPOS_CONTA.map((tipo) => `
        <button type="button" onclick="selecionarTipoContaCadastro('${tipo.chave}')"
          class="cartao text-left transition-all ${estado.tipoConta === tipo.chave ? 'borda-marca' : ''}"
          style="${estado.tipoConta === tipo.chave ? 'border-color: var(--cor-marca); box-shadow: 0 0 0 2px var(--cor-marca-sutil);' : ''}">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg fundo-marca-sutil texto-marca flex items-center justify-center"><i class="fa-solid ${tipo.icone}"></i></div>
            <h2 class="subtitulo texto-forte">${escaparHtml(tipo.titulo)}</h2>
          </div>
          <p class="text-sm texto-padrao leading-relaxed">${escaparHtml(tipo.descricao)}</p>
        </button>
      `).join('')}
    </div>
  `;
}

function htmlPasso2() {
  return `
    <div class="space-y-5">
      <div>
        <label for="cadastro-nome" class="rotulo-campo">Nome completo</label>
        <input id="cadastro-nome" type="text" class="input-padrao" value="${escaparHtml(estado.nome)}" oninput="atualizarCampoCadastro('nome', this.value)" />
      </div>
      <div>
        <label for="cadastro-email" class="rotulo-campo">E-mail</label>
        <input id="cadastro-email" type="email" class="input-padrao" value="${escaparHtml(estado.email)}" oninput="atualizarCampoCadastro('email', this.value)" />
      </div>
      <div>
        <label for="cadastro-cpf" class="rotulo-campo">CPF</label>
        <input id="cadastro-cpf" type="text" inputmode="numeric" placeholder="000.000.000-00" class="input-padrao" value="${escaparHtml(estado.cpf)}" oninput="atualizarCpfCadastro(this.value)" />
      </div>
      <div>
        <label for="cadastro-senha" class="rotulo-campo">Senha</label>
        <input id="cadastro-senha" type="password" class="input-padrao" value="${escaparHtml(estado.senha)}" oninput="atualizarCampoCadastro('senha', this.value)" />
        <div id="cadastro-medidor-forca" class="mt-3"></div>
      </div>
    </div>
  `;
}

function htmlMedidorForca() {
  const atendidos = REQUISITOS_SENHA.filter((req) => req.teste(estado.senha)).length;
  const percentual = (atendidos / REQUISITOS_SENHA.length) * 100;
  const cor = percentual === 100 ? 'var(--cor-texto-sucesso)' : percentual >= 50 ? 'var(--cor-urgencia-texto)' : 'var(--cor-texto-erro)';
  return `
    <div class="escala-progresso escala-progresso--tudo-ou-nada escala-progresso--compacta mb-3" style="--progresso: ${percentual}%">
      <div class="escala-progresso__trilho">
        <div class="escala-progresso__preenchimento" style="background-color: ${cor};"></div>
      </div>
    </div>
    <ul class="space-y-1.5">
      ${REQUISITOS_SENHA.map((req) => {
        const ok = req.teste(estado.senha);
        return `<li class="text-xs flex items-center gap-2 ${ok ? 'texto-sucesso' : 'texto-fraco'}"><i class="fa-solid ${ok ? 'fa-circle-check' : 'fa-circle'}"></i> ${escaparHtml(req.rotulo)}</li>`;
      }).join('')}
    </ul>
  `;
}

function htmlPasso3() {
  if (estado.lattesResultado) {
    const r = estado.lattesResultado;
    return `
      <div class="aviso-caixa aviso-caixa--sucesso mb-5">
        <i class="fa-solid fa-circle-check aviso-caixa__icone"></i>
        <div>Vínculo encontrado no Lattes.</div>
      </div>
      <div class="cartao mb-5">
        <p class="font-bold texto-forte">${escaparHtml(r.nome)}</p>
        <p class="text-sm texto-padrao mt-1">${escaparHtml(r.instituicao)}</p>
        <p class="text-xs texto-fraco mt-0.5">${escaparHtml(r.area)}</p>
      </div>
      <label class="flex items-start gap-2.5 text-sm texto-padrao cursor-pointer">
        <input type="checkbox" ${estado.aceite ? 'checked' : ''} onchange="atualizarAceiteCadastro(this.checked)" class="mt-0.5" />
        Confirmo que os dados acima me pertencem e aceito os termos de uso da plataforma.
      </label>
    `;
  }
  return `
    <div>
      <label for="cadastro-lattes-id" class="rotulo-campo">ID Lattes (CNPq)</label>
      <div class="flex gap-2">
        <input id="cadastro-lattes-id" type="text" placeholder="ex.: 0000000000000000" class="input-padrao" value="${escaparHtml(estado.lattesId)}" oninput="atualizarCampoCadastro('lattesId', this.value)" />
        <button type="button" onclick="validarLattesCadastro()" ${estado.lattesValidando ? 'disabled' : ''} class="btn btn-secondary shrink-0">
          ${estado.lattesValidando ? '<i class="fa-solid fa-spinner fa-spin"></i> Validando…' : 'Validar'}
        </button>
      </div>
      <p class="text-xs texto-fraco mt-2">Encontre seu ID em lattes.cnpq.br. A plataforma confirma o vínculo institucional a partir dele.</p>
    </div>
  `;
}

function htmlSucesso() {
  return `
    <div class="text-center py-6">
      <div class="w-16 h-16 rounded-full fundo-sucesso texto-sucesso flex items-center justify-center text-3xl mx-auto mb-5"><i class="fa-solid fa-envelope-circle-check"></i></div>
      <h2 class="titulo-secao mb-2">Verifique seu e-mail</h2>
      <p class="text-sm texto-padrao leading-relaxed mb-6">Enviamos um link de confirmação para <strong class="texto-forte">${escaparHtml(estado.email)}</strong>. Confirme para ativar sua conta.</p>
      <button type="button" onclick="nav('login')" class="btn btn-primary">Ir para o login</button>
    </div>
  `;
}

function renderizarNavegacao() {
  const container = document.getElementById('cadastro-navegacao');
  if (!container) return;
  if (estado.concluido) {
    container.innerHTML = '';
    return;
  }

  const podeVoltar = estado.passo > 1;
  let podeAvancar = false;
  let rotuloAvancar = 'Avançar';
  if (estado.passo === 1) podeAvancar = !!estado.tipoConta;
  else if (estado.passo === 2) {
    podeAvancar = passo2Valido();
    rotuloAvancar = estado.tipoConta === 'pesquisador' ? 'Avançar' : 'Concluir cadastro';
  } else if (estado.passo === 3) {
    podeAvancar = !!estado.lattesResultado && estado.aceite;
    rotuloAvancar = 'Concluir cadastro';
  }

  container.innerHTML = `
    <button type="button" onclick="voltarPassoCadastro()" class="btn btn-secondary" ${podeVoltar ? '' : 'style="visibility:hidden"'}>Voltar</button>
    <button type="button" onclick="avancarPassoCadastro()" class="btn btn-primary" ${podeAvancar ? '' : 'disabled'}>${rotuloAvancar}</button>
  `;
}

export function renderizarTelaCadastro() {
  const container = document.getElementById('cadastro-conteudo');
  if (!container) return;

  if (estado.concluido) {
    container.innerHTML = htmlSucesso();
    document.getElementById('cadastro-indicador-passos').innerHTML = '';
    renderizarNavegacao();
    return;
  }

  renderizarIndicadorPassos();
  if (estado.passo === 1) container.innerHTML = htmlPasso1();
  else if (estado.passo === 2) {
    container.innerHTML = htmlPasso2();
    document.getElementById('cadastro-medidor-forca').innerHTML = htmlMedidorForca();
  } else container.innerHTML = htmlPasso3();

  renderizarNavegacao();
}

export function selecionarTipoContaCadastro(chave) {
  estado.tipoConta = chave;
  renderizarTelaCadastro();
}

export function atualizarCampoCadastro(campo, valor) {
  estado[campo] = valor;
  if (campo === 'senha') {
    document.getElementById('cadastro-medidor-forca').innerHTML = htmlMedidorForca();
  }
  renderizarNavegacao();
}

export function atualizarCpfCadastro(valorDigitado) {
  estado.cpf = mascararCpf(valorDigitado);
  const input = document.getElementById('cadastro-cpf');
  if (input) input.value = estado.cpf;
  renderizarNavegacao();
}

export function atualizarAceiteCadastro(marcado) {
  estado.aceite = marcado;
  renderizarNavegacao();
}

export function validarLattesCadastro() {
  estado.lattesValidando = true;
  renderizarTelaCadastro();
  setTimeout(() => {
    estado.lattesValidando = false;
    estado.lattesResultado = RESULTADO_LATTES_SIMULADO;
    renderizarTelaCadastro();
  }, 1500);
}

export function voltarPassoCadastro() {
  if (estado.passo > 1) estado.passo -= 1;
  renderizarTelaCadastro();
}

export function avancarPassoCadastro() {
  if (estado.passo === 2 && estado.tipoConta !== 'pesquisador') {
    estado.concluido = true;
    mostrarAcao('Cadastro simulado concluído.');
    renderizarTelaCadastro();
    return;
  }
  if (estado.passo === 3) {
    estado.concluido = true;
    mostrarAcao('Cadastro simulado concluído.');
    renderizarTelaCadastro();
    return;
  }
  estado.passo += 1;
  renderizarTelaCadastro();
}
