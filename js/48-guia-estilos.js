// Guia de estilos: os componentes compartilhados em um só lugar, com demonstrações interativas.
// Baseado em src/screens/GuiaEstilos.tsx da Alexia (branch main), reescrito em JavaScript puro. Serve também para
// conferir o CSS (claro e escuro) depois de mexer em 4-componentes-restrita.css ou 9-CSS-do-projeto-de-interface.css.
import { htmlEstadoVazio } from './1-utilitarios.js';
import { mostrarAviso } from './25-avisos.js';
import { htmlCardProjeto } from './18-home.js';
import { htmlCampo, abrirModalFicha, htmlRodapeAcoes } from './44-interface-modal.js';
import { criarGrupoFiltroExpansivel } from './41-filtro-expansivel.js';
import { htmlSeloStatusConta } from './45-modais-conta.js';
import { htmlSeloStatusCampanha, htmlSeloModeloFinanciamento, STATUS_CAMPANHA } from './47-selos.js';

const OPCOES_FILTRO_DEMONSTRACAO = [
  { value: 'computacao', label: 'Ciência da Computação' },
  { value: 'biologia', label: 'Ciências Biológicas' },
  { value: 'saude', label: 'Ciências da Saúde' },
];

const CAMPANHA_DEMONSTRACAO = {
  id: 9001,
  image: 'imagens/projeto-computacao.jpg',
  badge: 'Flexível',
  badgeClasses: 'texto-info borda-info',
  status: 'em-captacao',
  title: 'Tecnologia aberta para a ciência brasileira',
  description: 'Um projeto demonstrativo para visualizar o cartão de campanha.',
  avatar: 'LM',
  avatarClasses: 'fundo-marca-sutil texto-marca borda-marca',
  researcher: 'Laura Martins',
  institution: 'Instituto de Pesquisa',
  uf: 'SP',
  category: 'Ciência da Computação',
  value: 'R$ 8.400',
  progressLabel: '42%',
  supportLabel: '36 apoiadores',
  timeLabel: '18 dias restantes',
  valorArrecadado: 8400,
  meta: 20000,
  modelo: 'flexivel',
  diasRestantes: 18,
};

const TOASTS = {
  sucesso: ['Ação concluída com sucesso.', 'sucesso'],
  erro: ['Não foi possível concluir a ação.', 'erro'],
  info: ['Nenhuma alteração foi feita.', 'info'],
  'sucesso-salvar': ['Alterações salvas.', 'sucesso'],
};

export function renderizarTelaGuiaEstilos() {
  const raiz = document.getElementById('view-guia-estilos');
  if (!raiz || raiz.dataset.inicializado) return;
  raiz.dataset.inicializado = 'true';
  const $ = (seletor) => raiz.querySelector(seletor);

  // toast e modal
  raiz.addEventListener('click', (evento) => {
    const toast = evento.target.closest('[data-guia-toast]');
    if (toast) { const [mensagem, tipo] = TOASTS[toast.dataset.guiaToast]; mostrarAviso(mensagem, tipo); return; }
    if (evento.target.closest('[data-guia-modal]')) {
      abrirModalFicha({
        titulo: 'Prévia do diálogo',
        subtitulo: 'Componente modal',
        corpoHtml: '<p class="paragrafo texto-padrao">O diálogo fecha pelo botão, ao clicar fora ou pela tecla Esc. O foco permanece dentro enquanto estiver aberto.</p>',
        rodapeHtml: htmlRodapeAcoes({ rotuloCancelar: 'Fechar diálogo' }),
      });
      return;
    }
    const ancora = evento.target.closest('[data-guia-ancora]');
    if (ancora) { evento.preventDefault(); document.querySelector(ancora.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' }); }
  });

  // estado vazio com ação
  $('#guia-estado-vazio').innerHTML = htmlEstadoVazio({
    icone: 'fa-magnifying-glass',
    titulo: 'Nenhum resultado encontrado',
    mensagem: 'Ajuste os filtros para encontrar projetos relacionados.',
    acaoHtml: '<button type="button" class="btn btn-secondary" data-guia-limpar>Limpar filtros</button>',
  });

  // filtros expansíveis (um ativo, um indisponível)
  let selecionadas = ['computacao'];
  const ativo = criarGrupoFiltroExpansivel($('#guia-filtro-ativo'), {
    titulo: 'Grandes áreas do conhecimento',
    aoAlterar: (valores) => { selecionadas = valores; atualizarFiltros(); },
  });
  const indisponivel = criarGrupoFiltroExpansivel($('#guia-filtro-desabilitado'), {
    titulo: 'Filtro indisponível',
    aoAlterar: () => {},
    mensagemDesabilitado: 'Selecione uma grande área para habilitar este filtro.',
  });
  function atualizarFiltros() {
    ativo.atualizar({ opcoes: OPCOES_FILTRO_DEMONSTRACAO, selecionados: selecionadas });
    indisponivel.atualizar({ opcoes: OPCOES_FILTRO_DEMONSTRACAO, selecionados: [], desabilitado: true });
  }
  atualizarFiltros();
  raiz.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-guia-limpar]')) { selecionadas = []; atualizarFiltros(); }
  });

  // campos de formulário: com ajuda e com erro
  $('#guia-campos').innerHTML = `
    ${htmlCampo({ rotulo: 'E-mail', dica: 'Usaremos este endereço para atualizações do projeto.', classe: 'campo', controle: (a) => `<input ${a} type="email" class="input-padrao w-full" placeholder="nome@exemplo.com">` })}
    ${htmlCampo({ rotulo: 'Código de validação', erro: 'Confira o código informado.', classe: 'campo', controle: (a) => `<input ${a} type="text" class="input-padrao w-full borda-erro" value="123">` })}`;

  // selos
  $('#guia-selos').innerHTML = [
    ...Object.keys(STATUS_CAMPANHA).map((status) => htmlSeloStatusCampanha(status)),
    htmlSeloModeloFinanciamento('flexivel'),
    htmlSeloModeloFinanciamento('tudo-ou-nada'),
    htmlSeloStatusConta(true),
    htmlSeloStatusConta(false),
    '<button type="button" class="btn btn-secondary inline-flex items-center gap-2"><i class="fa-brands fa-google" aria-hidden="true"></i>Continuar com Google</button>',
  ].join('');

  // cartão de campanha (o botão de seguir usa a função global do cartão)
  $('#guia-cartao-campanha').innerHTML = htmlCardProjeto(CAMPANHA_DEMONSTRACAO);

  // carregar mais
  let visiveis = 3;
  const desenharMais = () => {
    $('#guia-mais-resultados').innerHTML = `
      <p class="texto-fraco text-sm mb-3">Mostrando ${visiveis} de 8</p>
      ${visiveis < 8 ? '<button type="button" class="btn btn-secondary" data-guia-mais>Carregar mais exemplos</button>' : ''}`;
  };
  desenharMais();
  raiz.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-guia-mais]')) { visiveis = Math.min(visiveis + 3, 8); desenharMais(); }
  });
}
