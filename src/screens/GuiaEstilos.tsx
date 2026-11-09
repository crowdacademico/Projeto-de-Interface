// A guia permite visualizar e experimentar os componentes compartilhados em um só lugar.
import { useId } from 'react';
import { IconeProvedor } from '../components/auth/icone-provedor';
import { CaixaAviso } from '../components/crud/caixa-aviso';
import { CartaoCampanha } from '../components/crud/cartao-campanha';
import { EstadoVazio } from '../components/crud/estado-vazio';
import { RodapeAcoes } from '../components/crud/rodape-acoes';
import { SeloModeloFinanciamento } from '../components/crud/selo-modelo-financiamento';
import { SeloStatusCampanha } from '../components/crud/selo-status-campanha';
import { SeloStatusConta } from '../components/crud/selo-status-conta';
import { TabelaGenerica } from '../components/crud/tabela-generica';
import { Campo } from '@restrita/components/input/campo';
import { ModalBase } from '../components/layout/modal-base';
import { Toast } from '../components/layout/toast';
import { Tooltip } from '../components/layout/tooltip';
import { MaisResultados } from '../components/pagination/mais-resultados';
import { BarraBusca } from '../components/search/barra-busca';
import { GrupoFiltroExpansivel } from '../components/search/grupo-filtro-expansivel';
import { CAMPANHA_DEMONSTRACAO, OPCOES_FILTRO_DEMONSTRACAO } from './guia-estilos.constants';
import { useGuiaEstilos } from './use-guia-estilos';

export function TelaGuiaEstilos() {
  const idBusca = useId();
  const idTooltip = useId();
  const {
    modalAberto,
    setModalAberto,
    mensagemToast,
    setMensagemToast,
    tipoToast,
    areasSelecionadas,
    setAreasSelecionadas,
    seguindo,
    setSeguindo,
    resultadosVisiveis,
    mostrarMaisResultados,
    mostrarToast,
  } = useGuiaEstilos();

  return (
    <main id="view-guia-estilos" className="view-section flex-grow fundo-sutil py-secao">
      <div className="mx-auto max-w-conteudo px-4 sm:px-6 lg:px-8">
        <header className="mb-secao">
          <p className="microrrotulo texto-marca mb-3">Biblioteca visual</p>
          <h1 className="titulo-pagina mb-4">Guia de estilos</h1>
          <p className="paragrafo texto-padrao max-w-leitura">
            Componentes compartilhados do Projeto de Interface. Experimente os controles e veja como
            cada peça se apresenta em situações comuns da plataforma.
          </p>
        </header>

        <nav className="mb-secao rounded-xl border borda-padrao fundo-cartao p-6" aria-label="Nesta página">
          <h2 className="subtitulo texto-forte mb-4">Componentes</h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            <li><a className="texto-marca hover:underline" href="#guia-botoes">Ações e avisos</a></li>
            <li><a className="texto-marca hover:underline" href="#guia-busca">Busca e filtros</a></li>
            <li><a className="texto-marca hover:underline" href="#guia-formularios">Formulários e tabela</a></li>
            <li><a className="texto-marca hover:underline" href="#guia-status">Status e autenticação</a></li>
            <li><a className="texto-marca hover:underline" href="#guia-cartao">Cartão de campanha</a></li>
          </ul>
        </nav>

        <div className="space-y-secao">
          <section id="guia-botoes" className="scroll-mt-sticky rounded-xl border borda-padrao fundo-cartao p-6 sm:p-8">
            <h2 className="titulo-secao texto-forte mb-2">Ações e avisos</h2>
            <p className="paragrafo texto-padrao mb-6">Ações, alertas, estado vazio, tooltip, toast e diálogo modal.</p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button type="button" className="btn btn-primary" onClick={() => mostrarToast('sucesso', 'Ação concluída com sucesso.')}>
                Exibir toast
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setModalAberto(true)}>
                Abrir modal
              </button>
              <span className="group/filter relative inline-flex">
                <button type="button" className="btn btn-secondary" aria-describedby={idTooltip}>
                  <i className="fa-solid fa-circle-question mr-2" aria-hidden="true" />
                  Passe o foco para ver a dica
                </button>
                <Tooltip id={idTooltip} texto="Dicas ajudam a explicar um controle sem ocupar espaço permanente." />
              </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <CaixaAviso titulo="Aviso informativo" tom="info">
                Use avisos para destacar uma informação importante no contexto da tarefa.
              </CaixaAviso>
              <CaixaAviso titulo="Atenção necessária" tom="atencao">
                Este exemplo mostra uma variação de tom do mesmo componente.
              </CaixaAviso>
              <EstadoVazio
                titulo="Nenhum resultado encontrado"
                texto="Ajuste os filtros para encontrar projetos relacionados."
                icone="fa-magnifying-glass"
                acao={<button type="button" className="btn btn-secondary" onClick={() => setAreasSelecionadas([])}>Limpar filtros</button>}
              />
              <div className="rounded-lg border borda-padrao p-5">
                <h3 className="subtitulo texto-forte mb-3">Rodapé de ações</h3>
                <RodapeAcoes>
                  <button type="button" className="btn btn-secondary" onClick={() => mostrarToast('info', 'Nenhuma alteração foi feita.')}>Cancelar</button>
                  <button type="button" className="btn btn-primary" onClick={() => mostrarToast('sucesso', 'Alterações salvas.')}>Salvar alterações</button>
                </RodapeAcoes>
              </div>
            </div>

            {mensagemToast && (
              <div className="mt-6 rounded-lg border borda-padrao p-4" aria-label="Prévia de toast">
                <Toast
                  mensagem={mensagemToast}
                  tipo={tipoToast}
                  idBotaoFechar="fechar-toast-guia"
                  aoFechar={() => setMensagemToast(null)}
                />
              </div>
            )}
          </section>

          <section id="guia-busca" className="scroll-mt-sticky rounded-xl border borda-padrao fundo-cartao p-6 sm:p-8">
            <h2 className="titulo-secao texto-forte mb-2">Busca e filtros</h2>
            <p className="paragrafo texto-padrao mb-6">Campos de busca e grupos expansíveis podem ser combinados em catálogos.</p>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="subtitulo texto-forte">Barra de busca</h3>
                <BarraBusca id={idBusca} rotulo="Buscar projetos" placeholder="Buscar por projeto ou pesquisador" />
              </div>
              <div className="space-y-4">
                <h3 className="subtitulo texto-forte">Grupo de filtros expansível</h3>
                <GrupoFiltroExpansivel
                  titulo="Grandes áreas do conhecimento"
                  opcoes={OPCOES_FILTRO_DEMONSTRACAO}
                  valoresSelecionados={areasSelecionadas}
                  aoAlterar={setAreasSelecionadas}
                  expandidoPorPadrao
                />
                <GrupoFiltroExpansivel
                  titulo="Filtro indisponível"
                  opcoes={OPCOES_FILTRO_DEMONSTRACAO}
                  valoresSelecionados={[]}
                  aoAlterar={() => undefined}
                  desabilitado
                  mensagemDesabilitado="Selecione uma grande área para habilitar este filtro."
                />
              </div>
            </div>
          </section>

          <section id="guia-formularios" className="scroll-mt-sticky rounded-xl border borda-padrao fundo-cartao p-6 sm:p-8">
            <h2 className="titulo-secao texto-forte mb-2">Formulários e tabela</h2>
            <p className="paragrafo texto-padrao mb-6">Campos com rótulo, ajuda e erro acessivelmente associados, além de tabela semântica.</p>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-5">
                <Campo rotulo="E-mail" dica="Usaremos este endereço para atualizações do projeto." className="campo">
                  {({ atributos, classeErro }) => <input {...atributos} type="email" className={`input-padrao w-full${classeErro}`} placeholder="nome@exemplo.com" />}
                </Campo>
                <Campo rotulo="Código de validação" erro={<span className="texto-erro">Confira o código informado.</span>} className="campo">
                  {({ atributos, classeErro }) => <input {...atributos} type="text" className={`input-padrao w-full${classeErro}`} defaultValue="123" />}
                </Campo>
              </div>
              <TabelaGenerica colunas={['Componente', 'Uso', 'Estado']} legenda="Exemplos de componentes e estados">
                <tr><th scope="row">Campo de formulário</th><td>Entrada de dados</td><td>Com ajuda</td></tr>
                <tr><th scope="row">Toast</th><td>Confirmação breve</td><td>Interativo</td></tr>
                <tr><th scope="row">Modal</th><td>Diálogo</td><td>Abre por botão</td></tr>
              </TabelaGenerica>
            </div>
          </section>

          <section id="guia-status" className="scroll-mt-sticky rounded-xl border borda-padrao fundo-cartao p-6 sm:p-8">
            <h2 className="titulo-secao texto-forte mb-2">Status e autenticação</h2>
            <p className="paragrafo texto-padrao mb-6">Selos comunicam estados de domínio; ícones de provedor complementam ações de login.</p>
            <div className="flex flex-wrap items-center gap-3">
              <SeloStatusCampanha status="em-captacao" />
              <SeloStatusCampanha status="financiada" />
              <SeloStatusCampanha status="nao-financiada" />
              <SeloStatusCampanha status="em-breve" />
              <SeloModeloFinanciamento modelo="flexivel" />
              <SeloModeloFinanciamento modelo="tudo-ou-nada" />
              <SeloStatusConta emailVerificado />
              <SeloStatusConta emailVerificado={false} />
              <button type="button" className="btn btn-secondary inline-flex items-center gap-2">
                <IconeProvedor provedor="google" />
                Continuar com Google
              </button>
            </div>
          </section>

          <section id="guia-cartao" className="scroll-mt-sticky rounded-xl border borda-padrao fundo-cartao p-6 sm:p-8">
            <h2 className="titulo-secao texto-forte mb-2">Cartão de campanha e paginação</h2>
            <p className="paragrafo texto-padrao mb-6">Prévia real do cartão e controle de carregamento incremental.</p>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="max-w-sm">
                <CartaoCampanha
                  campanha={CAMPANHA_DEMONSTRACAO}
                  seguindo={seguindo}
                  onAbrir={() => setModalAberto(true)}
                  onAlternarSeguir={(_evento, id) => setSeguindo((atual) => !atual && id === CAMPANHA_DEMONSTRACAO.id)}
                />
              </div>
              <div className="space-y-6">
                <MaisResultados
                  mostrando={resultadosVisiveis}
                  total={8}
                  idBotao="mais-resultados-guia"
                  aoClicar={mostrarMaisResultados}
                  rotulo="Carregar mais exemplos"
                />
                <p className="paragrafo texto-padrao">
                  O botão atualiza a quantidade exibida sem sair desta página.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ModalBase aberto={modalAberto} titulo="Prévia do diálogo" aoFechar={() => setModalAberto(false)}>
        <div className="space-y-4 p-6">
          <p className="microrrotulo texto-marca">Componente modal</p>
          <h2 className="titulo-secao texto-forte">Prévia interativa</h2>
          <p className="paragrafo texto-padrao">O diálogo fecha pelo botão, ao clicar fora ou pela tecla Esc. O foco permanece dentro enquanto estiver aberto.</p>
          <button type="button" className="btn btn-primary" onClick={() => setModalAberto(false)}>Fechar diálogo</button>
        </div>
      </ModalBase>
    </main>
  );
}
