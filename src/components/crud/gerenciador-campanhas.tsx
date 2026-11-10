// O gerenciador reúne campanhas e dados relacionados em tabelas numa única área de trabalho.
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { CampoFicha, SecaoFicha } from '@restrita/components/crud/ficha-consulta';
import { ModalFicha } from '@restrita/components/crud/modal-ficha';
import { RodapeAcoes } from '@restrita/components/crud/rodape-acoes';
import { Campo } from '@restrita/components/input/campo';
import { ContadorCaracteres } from '@restrita/components/input/contador-caracteres';
import { InputDinheiro } from '@restrita/components/input/input-dinheiro';
import { EstadoVazio } from './estado-vazio';
import { TabelaGenerica } from './tabela-generica';

type TipoRecompensa = 'reconhecimento' | 'acesso_antecipado' | 'digital';
type FaseAtualizacao = 'andamento' | 'resultado_preliminar' | 'resultado_final';
type TipoAtualizacao = 'texto' | 'imagem' | 'pdf' | 'linkexterno';

interface RecompensaCampanha {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoRecompensa;
  valorMinimo: string;
  quantidadeDisponivel: number | null;
  escolhidas: number;
  ativo: boolean;
  url: string;
  tipoLink: string;
}

interface AtualizacaoCampanha {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  fase: FaseAtualizacao;
  tipo: TipoAtualizacao;
  anexos?: { nome: string; mime: string }[];
  url?: string;
  ativo: boolean;
}

interface ComentarioCampanha {
  id: string;
  autor: string;
  texto: string;
  criadoEm: string;
  endossado: boolean;
  ordemEndosso?: number;
  ativo: boolean;
}

interface ContribuicaoCampanha {
  id: string;
  criadoEm: string;
  apoiador: string;
  valor: string;
  status: string;
  pagamento: string;
  recompensaId?: string;
}

interface CampanhaPesquisador {
  id: string;
  titulo: string;
  resumo: string;
  meta: string;
  estado: string;
  arrecadado: string;
  capaUrl: string;
  videoUrl: string;
  dataInicio: string;
  dataFim: string;
  modalidade: string;
  recompensas: RecompensaCampanha[];
  atualizacoes: AtualizacaoCampanha[];
  comentarios: ComentarioCampanha[];
  contribuicoes: ContribuicaoCampanha[];
}

interface GerenciadorCampanhasProps {
  campanhas: CampanhaPesquisador[];
  aoAlterar: (campanhas: CampanhaPesquisador[]) => void;
  aoCriarCampanha: () => void;
}

type SecaoGerenciador = 'campanhas' | 'recompensas' | 'atualizacoes' | 'comentarios' | 'contribuicoes';

const ITENS_MENU: { id: SecaoGerenciador; rotulo: string; icone: string }[] = [
  { id: 'campanhas', rotulo: 'Campanhas', icone: 'fa-flask' },
  { id: 'recompensas', rotulo: 'Recompensas', icone: 'fa-gift' },
  { id: 'atualizacoes', rotulo: 'Atualizações', icone: 'fa-arrows-rotate' },
  { id: 'comentarios', rotulo: 'Comentários', icone: 'fa-comments' },
  { id: 'contribuicoes', rotulo: 'Contribuições', icone: 'fa-hand-holding-heart' },
];

const ROTULO_RECOMPENSA: Record<TipoRecompensa, string> = {
  reconhecimento: 'Reconhecimento',
  acesso_antecipado: 'Acesso antecipado',
  digital: 'Conteúdo digital',
};

const ROTULO_FASE: Record<FaseAtualizacao, string> = {
  andamento: 'Em andamento',
  resultado_preliminar: 'Resultado preliminar',
  resultado_final: 'Resultado final',
};

const ROTULO_TIPO_ATUALIZACAO: Record<TipoAtualizacao, string> = {
  texto: 'Texto',
  imagem: 'Imagem',
  pdf: 'PDF',
  linkexterno: 'Link externo',
};

const ROTULO_MODALIDADE: Record<string, string> = {
  'all-or-nothing': 'Tudo ou Nada',
  flexivel: 'Flexível',
};

const ROTULO_STATUS: Record<string, string> = {
  'Em captação': 'Ativa',
  Finalizada: 'Encerrada',
  Rascunho: 'Rascunho',
  'Aguardando aprovação': 'Aguardando aprovação',
  Rejeitada: 'Rejeitada',
};

const ROTULO_STATUS_CONTRIBUICAO: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  repassado: 'Repassado',
  a_devolver: 'A devolver',
  devolvido: 'Devolvido',
  reembolsado: 'Reembolsado',
  erro: 'Erro',
  expirado: 'Expirado',
  reembolso_manual: 'Reembolso manual',
};

const ROTULO_PAGAMENTO: Record<string, string> = {
  pix: 'PIX',
  cartao_credito: 'Cartão de crédito',
  cartao_debito: 'Cartão de débito',
  boleto: 'Boleto',
};

const TIPOS_RECOMPENSA: TipoRecompensa[] = ['reconhecimento', 'acesso_antecipado', 'digital'];
const FASES_ATUALIZACAO: FaseAtualizacao[] = ['andamento', 'resultado_preliminar', 'resultado_final'];
const LIMITE_ENDOSSOS_CAMPANHA = 4;
const LIMITE_CARACTERES_ATUALIZACAO = 5000;
const TIPOS_MIME_ANEXO = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

function dataLegivel(data: string) {
  if (!data) return '—';
  const valor = new Date(`${data.slice(0, 10)}T12:00:00`);
  return Number.isNaN(valor.getTime()) ? data : valor.toLocaleDateString('pt-BR');
}

function valorLegivel(valor: string | number) {
  const numero = Number(valor);
  return Number.isFinite(numero)
    ? numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';
}

function tipoAtualizacao(anexos: { mime: string }[], url: string): TipoAtualizacao {
  if (anexos.some((anexo) => anexo.mime === 'application/pdf')) return 'pdf';
  if (anexos.some((anexo) => anexo.mime.startsWith('image/'))) return 'imagem';
  return url.trim() ? 'linkexterno' : 'texto';
}

function criarId(prefixo: string) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function Tabela({ rotulo, colunas, children }: { rotulo: string; colunas: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border borda-padrao fundo-cartao" role="region" aria-label={rotulo} tabIndex={0}>
      <TabelaGenerica colunas={colunas} legenda={rotulo}>{children}</TabelaGenerica>
    </div>
  );
}

function BotaoAcao({ children, onClick, disabled = false, titulo }: { children: ReactNode; onClick: () => void; disabled?: boolean; titulo?: string }) {
  return (
    <button type="button" className="btn btn-secondary btn-pequeno whitespace-nowrap" onClick={onClick} disabled={disabled} title={titulo}>
      {children}
    </button>
  );
}

function CampoSelect({
  rotulo,
  valor,
  opcoes,
  aoMudar,
  dica,
}: {
  rotulo: string;
  valor: string;
  opcoes: { valor: string; rotulo: string }[];
  aoMudar: (valor: string) => void;
  dica?: string;
}) {
  return (
    <Campo rotulo={rotulo} dica={dica}>
      {({ atributos, classeErro }) => (
        <select {...atributos} value={valor} onChange={(evento) => aoMudar(evento.target.value)} className={'input-padrao' + classeErro}>
          {opcoes.map((opcao) => <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>)}
        </select>
      )}
    </Campo>
  );
}

function ModalConsultarCampanha({ campanha, aoFechar }: { campanha: CampanhaPesquisador; aoFechar: () => void }) {
  return (
    <ModalFicha titulo="Consultar campanha" subtitulo={campanha.titulo} aoFechar={aoFechar}>
      <SecaoFicha titulo="Dados da campanha">
        <CampoFicha rotulo="Estado" valor={ROTULO_STATUS[campanha.estado] ?? campanha.estado} />
        <CampoFicha rotulo="Modalidade" valor={ROTULO_MODALIDADE[campanha.modalidade] ?? campanha.modalidade} />
        <CampoFicha rotulo="Lançamento" valor={dataLegivel(campanha.dataInicio)} />
        <CampoFicha rotulo="Encerramento" valor={dataLegivel(campanha.dataFim)} />
        <CampoFicha rotulo="Meta" valor={valorLegivel(campanha.meta)} />
        <CampoFicha rotulo="Arrecadado" valor={campanha.arrecadado} />
        <CampoFicha rotulo="Vídeo de apresentação" valor={campanha.videoUrl || 'Não informado'} largura="cheia" />
        <CampoFicha rotulo="Resumo" valor={campanha.resumo} largura="cheia" />
      </SecaoFicha>
    </ModalFicha>
  );
}

function ModalEditarCampanha({
  campanha,
  aoFechar,
  aoSalvar,
}: {
  campanha: CampanhaPesquisador;
  aoFechar: () => void;
  aoSalvar: (campanha: CampanhaPesquisador) => void;
}) {
  const [titulo, setTitulo] = useState(campanha.titulo);
  const [resumo, setResumo] = useState(campanha.resumo);
  const [meta, setMeta] = useState(campanha.meta);
  const [dataInicio, setDataInicio] = useState(campanha.dataInicio);
  const [dataFim, setDataFim] = useState(campanha.dataFim);
  const [modalidade, setModalidade] = useState(campanha.modalidade);
  const [erro, setErro] = useState('');

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (titulo.trim().length < 3 || !(Number(meta) >= 500) || !dataInicio || !dataFim || dataFim < dataInicio) {
      setErro('Informe título, meta mínima de R$ 500,00 e um período de encerramento posterior ao lançamento.');
      return;
    }
    aoSalvar({ ...campanha, titulo: titulo.trim(), resumo: resumo.trim(), meta, dataInicio, dataFim, modalidade });
  }

  return (
    <ModalFicha
      titulo="Editar campanha"
      subtitulo={campanha.titulo}
      aoFechar={aoFechar}
      rodape={<RodapeAcoes aoCancelar={aoFechar} acao={{ rotulo: 'Salvar alterações', formulario: 'form-editar-campanha-gerenciador' }} />}
    >
      <form id="form-editar-campanha-gerenciador" onSubmit={salvar} className="space-y-4">
        <Campo rotulo="Nome da campanha">
          {({ atributos, classeErro }) => <input {...atributos} required maxLength={255} value={titulo} onChange={(evento) => setTitulo(evento.target.value)} className={'input-padrao' + classeErro} />}
        </Campo>
        <Campo rotulo="Resumo">
          {({ atributos, classeErro }) => <textarea {...atributos} rows={3} value={resumo} onChange={(evento) => setResumo(evento.target.value)} className={'input-padrao' + classeErro} />}
        </Campo>
        <Campo rotulo="Meta (R$)" dica="A meta mínima deste protótipo é R$ 500,00.">
          {({ atributos, classeErro }) => <InputDinheiro {...atributos} valor={meta} aoMudar={setMeta} className={'input-padrao' + classeErro} />}
        </Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo rotulo="Lançamento">
            {({ atributos, classeErro }) => <input {...atributos} type="date" required value={dataInicio} onChange={(evento) => setDataInicio(evento.target.value)} className={'input-padrao' + classeErro} />}
          </Campo>
          <Campo rotulo="Encerramento">
            {({ atributos, classeErro }) => <input {...atributos} type="date" required value={dataFim} onChange={(evento) => setDataFim(evento.target.value)} className={'input-padrao' + classeErro} />}
          </Campo>
        </div>
        <CampoSelect
          rotulo="Modalidade"
          valor={modalidade}
          aoMudar={setModalidade}
          opcoes={[
            { valor: 'all-or-nothing', rotulo: 'Tudo ou Nada' },
            { valor: 'flexivel', rotulo: 'Flexível' },
          ]}
        />
        {erro && <p className="erro-campo" role="alert">{erro}</p>}
      </form>
    </ModalFicha>
  );
}

function ModalRecompensaCampanha({
  campanhas,
  campanhaInicial,
  recompensa,
  aoFechar,
  aoSalvar,
}: {
  campanhas: CampanhaPesquisador[];
  campanhaInicial: string;
  recompensa?: RecompensaCampanha & { campanhaId: string };
  aoFechar: () => void;
  aoSalvar: (campanhaId: string, recompensa: RecompensaCampanha) => void;
}) {
  const [campanhaId, setCampanhaId] = useState(recompensa?.campanhaId ?? campanhaInicial);
  const [titulo, setTitulo] = useState(recompensa?.titulo ?? '');
  const [descricao, setDescricao] = useState(recompensa?.descricao ?? '');
  const [tipo, setTipo] = useState<TipoRecompensa>(recompensa?.tipo ?? 'reconhecimento');
  const [valorMinimo, setValorMinimo] = useState(recompensa?.valorMinimo ?? '');
  const [quantidade, setQuantidade] = useState(recompensa?.quantidadeDisponivel?.toString() ?? '');
  const [url, setUrl] = useState(recompensa?.url ?? '');
  const [erro, setErro] = useState('');
  const selecionada = (recompensa?.escolhidas ?? 0) > 0;
  const requerLink = tipo !== 'reconhecimento';

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const quantidadeNumerica = quantidade === '' ? null : Number(quantidade);
    let urlValida = true;
    if (requerLink) {
      try {
        const endereco = new URL(url);
        urlValida = endereco.protocol === 'https:' && ['github.com', 'www.github.com'].includes(endereco.hostname) && endereco.pathname.length > 1;
      } catch {
        urlValida = false;
      }
    }
    if (!titulo.trim() || titulo.length > 150 || !(Number(valorMinimo) > 0) || !urlValida ||
      (quantidade !== '' && (!Number.isInteger(quantidadeNumerica) || Number(quantidadeNumerica) < (recompensa?.escolhidas ?? 0)))) {
      setErro(requerLink
        ? 'Confira o título, o valor mínimo, a disponibilidade e informe um link HTTPS válido do GitHub.'
        : 'Confira o título, o valor mínimo e a disponibilidade. Deixe a disponibilidade vazia para não limitar unidades.');
      return;
    }
    aoSalvar(campanhaId, {
      id: recompensa?.id ?? criarId('recompensa'),
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipo,
      valorMinimo: Number(valorMinimo).toFixed(2),
      quantidadeDisponivel: quantidadeNumerica,
      escolhidas: recompensa?.escolhidas ?? 0,
      ativo: recompensa?.ativo ?? true,
      url: requerLink ? url.trim() : '',
      tipoLink: requerLink ? 'GitHub' : '',
    });
  }

  return (
    <ModalFicha
      titulo={recompensa ? 'Alterar recompensa' : 'Nova recompensa'}
      subtitulo="Recompensas simbólicas, sem estoque ou entrega física."
      aoFechar={aoFechar}
      rodape={<RodapeAcoes aoCancelar={aoFechar} acao={{ rotulo: recompensa ? 'Salvar' : 'Cadastrar recompensa', formulario: 'form-recompensa-campanha' }} />}
    >
      <form id="form-recompensa-campanha" onSubmit={salvar} className="space-y-4">
        {!recompensa && (
          <CampoSelect
            rotulo="Campanha"
            valor={campanhaId}
            aoMudar={setCampanhaId}
            opcoes={campanhas.map((item) => ({ valor: item.id, rotulo: item.titulo }))}
          />
        )}
        <Campo rotulo="Título">
          {({ atributos, classeErro }) => <input {...atributos} required maxLength={150} value={titulo} onChange={(evento) => setTitulo(evento.target.value)} className={'input-padrao' + classeErro} />}
        </Campo>
        <Campo rotulo="Valor mínimo para receber (R$)" dica="Precisa ser maior que zero.">
          {({ atributos, classeErro }) => <InputDinheiro {...atributos} valor={valorMinimo} disabled={selecionada} aoMudar={setValorMinimo} className={'input-padrao' + classeErro} />}
        </Campo>
        <CampoSelect
          rotulo="Tipo"
          valor={tipo}
          aoMudar={(valor) => setTipo(valor as TipoRecompensa)}
          opcoes={TIPOS_RECOMPENSA.map((valor) => ({ valor, rotulo: ROTULO_RECOMPENSA[valor] }))}
          dica="Acesso antecipado e conteúdo digital precisam de link especial."
        />
        {selecionada && <p className="text-sm texto-fraco" role="note">O tipo e o valor mínimo não podem ser alterados após uma contribuição escolher esta recompensa.</p>}
        <Campo rotulo="Descrição (opcional)">
          {({ atributos, classeErro }) => <textarea {...atributos} maxLength={10000} rows={2} value={descricao} onChange={(evento) => setDescricao(evento.target.value)} className={'input-padrao' + classeErro} />}
        </Campo>
        <Campo rotulo="Quantidade disponível (opcional)" dica="Deixe vazio para quantidade ilimitada.">
          {({ atributos, classeErro }) => <input {...atributos} type="number" min={recompensa?.escolhidas ?? 0} step={1} value={quantidade} onChange={(evento) => setQuantidade(evento.target.value)} className={'input-padrao' + classeErro} />}
        </Campo>
        {requerLink && (
          <>
            <CampoSelect rotulo="Tipo do link" valor="GitHub" aoMudar={() => undefined} opcoes={[{ valor: 'GitHub', rotulo: 'GitHub' }]} />
            <Campo rotulo="Link especial" dica="O acesso fica disponível somente para quem adquirir a recompensa.">
              {({ atributos, classeErro }) => <input {...atributos} type="url" required maxLength={500} placeholder="https://github.com/..." value={url} onChange={(evento) => setUrl(evento.target.value)} className={'input-padrao' + classeErro} />}
            </Campo>
          </>
        )}
        {erro && <p className="erro-campo" role="alert">{erro}</p>}
      </form>
    </ModalFicha>
  );
}

function ModalAtualizacaoCampanha({
  campanhas,
  campanhaInicial,
  atualizacao,
  aoFechar,
  aoSalvar,
}: {
  campanhas: CampanhaPesquisador[];
  campanhaInicial: string;
  atualizacao?: AtualizacaoCampanha & { campanhaId: string };
  aoFechar: () => void;
  aoSalvar: (campanhaId: string, atualizacao: AtualizacaoCampanha) => void;
}) {
  const [campanhaId, setCampanhaId] = useState(atualizacao?.campanhaId ?? campanhaInicial);
  const [titulo, setTitulo] = useState(atualizacao?.titulo ?? '');
  const [mensagem, setMensagem] = useState(atualizacao?.mensagem ?? '');
  const [fase, setFase] = useState<FaseAtualizacao>(atualizacao?.fase ?? 'andamento');
  const [anexos, setAnexos] = useState<{ nome: string; mime: string }[]>(atualizacao?.anexos ?? []);
  const [url, setUrl] = useState(atualizacao?.url ?? '');
  const [erro, setErro] = useState('');

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    let urlValida = true;
    if (url.trim()) {
      try {
        const endereco = new URL(url);
        urlValida = (endereco.protocol === 'https:' || endereco.protocol === 'http:') && Boolean(endereco.hostname);
      } catch {
        urlValida = false;
      }
    }
    if (!titulo.trim() || titulo.length > 150 || !mensagem.trim() || mensagem.length > LIMITE_CARACTERES_ATUALIZACAO || !urlValida) {
      setErro('Informe um título, conteúdo de até 5.000 caracteres e um link válido, se houver.');
      return;
    }
    aoSalvar(campanhaId, {
      id: atualizacao?.id ?? criarId('atualizacao'),
      titulo: titulo.trim(),
      mensagem: mensagem.trim(),
      data: atualizacao?.data ?? new Date().toISOString().slice(0, 10),
      fase,
      tipo: atualizacao ? atualizacao.tipo : tipoAtualizacao(anexos, url),
      anexos,
      url: url.trim(),
      ativo: atualizacao?.ativo ?? true,
    });
  }

  return (
    <ModalFicha
      titulo={atualizacao ? 'Alterar atualização' : 'Nova atualização'}
      subtitulo="Registre o andamento ou os resultados da pesquisa."
      aoFechar={aoFechar}
      rodape={<RodapeAcoes aoCancelar={aoFechar} acao={{ rotulo: atualizacao ? 'Salvar' : 'Publicar atualização', formulario: 'form-atualizacao-campanha' }} />}
    >
      <form id="form-atualizacao-campanha" onSubmit={salvar} className="space-y-4">
        {!atualizacao && (
          <CampoSelect
            rotulo="Campanha"
            valor={campanhaId}
            aoMudar={setCampanhaId}
            opcoes={campanhas.map((item) => ({ valor: item.id, rotulo: item.titulo }))}
          />
        )}
        <Campo rotulo="Título">
          {({ atributos, classeErro }) => <input {...atributos} required maxLength={150} value={titulo} onChange={(evento) => setTitulo(evento.target.value)} className={'input-padrao' + classeErro} />}
        </Campo>
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoSelect rotulo="Fase" valor={fase} aoMudar={(valor) => setFase(valor as FaseAtualizacao)} opcoes={FASES_ATUALIZACAO.map((valor) => ({ valor, rotulo: ROTULO_FASE[valor] }))} />
          {atualizacao
            ? <Campo rotulo="Formato">{() => <p className="input-padrao">{ROTULO_TIPO_ATUALIZACAO[atualizacao.tipo]}</p>}</Campo>
            : <Campo rotulo="Formato determinado pelos anexos">{() => <p className="input-padrao">{ROTULO_TIPO_ATUALIZACAO[tipoAtualizacao(anexos, url)]}</p>}</Campo>}
        </div>
        <Campo rotulo="Mensagem">
          {({ atributos, classeErro }) => (
            <>
              <textarea {...atributos} required maxLength={LIMITE_CARACTERES_ATUALIZACAO} rows={5} value={mensagem} onChange={(evento) => setMensagem(evento.target.value)} className={'input-padrao' + classeErro} />
              <ContadorCaracteres texto={mensagem} limite={LIMITE_CARACTERES_ATUALIZACAO} />
            </>
          )}
        </Campo>
        {atualizacao ? (
          <SecaoFicha titulo="Anexos">
            <CampoFicha rotulo="Arquivos e links" valor={[...(atualizacao.anexos ?? []).map((anexo) => anexo.nome), ...(atualizacao.url ? [atualizacao.url] : [])].join(', ') || 'Nenhum'} largura="cheia" />
          </SecaoFicha>
        ) : (
          <SecaoFicha titulo="Anexos" colunas={1}>
            <div className="space-y-4">
              <Campo rotulo="Arquivos (imagem ou PDF, opcional)">
                {({ atributos }) => (
                  <input
                    {...atributos}
                    type="file"
                    multiple
                    accept={TIPOS_MIME_ANEXO.join(',')}
                    onChange={(evento) => {
                      const novosAnexos = Array.from(evento.target.files ?? []);
                      if (novosAnexos.some((arquivo) => !TIPOS_MIME_ANEXO.includes(arquivo.type))) {
                        setErro('Anexe somente imagens JPEG, PNG, WebP ou arquivos PDF.');
                        evento.target.value = '';
                        return;
                      }
                      setAnexos([...anexos, ...novosAnexos.map((arquivo) => ({ nome: arquivo.name, mime: arquivo.type }))]);
                      setErro('');
                      evento.target.value = '';
                    }}
                    className="input-padrao"
                  />
                )}
              </Campo>
              {anexos.length > 0 && (
                <ul className="space-y-2" aria-label="Arquivos selecionados">
                  {anexos.map((anexo, indice) => (
                    <li key={`${anexo.nome}-${indice}`} className="flex items-center justify-between gap-3 text-sm texto-fraco">
                      <span>{anexo.nome}</span>
                      <button type="button" className="btn btn-secondary btn-pequeno" onClick={() => setAnexos(anexos.filter((_, item) => item !== indice))}>Remover</button>
                    </li>
                  ))}
                </ul>
              )}
              <Campo rotulo="Endereço do link (opcional)">
                {({ atributos, classeErro }) => <input {...atributos} type="url" maxLength={500} value={url} onChange={(evento) => setUrl(evento.target.value)} className={'input-padrao' + classeErro} />}
              </Campo>
            </div>
          </SecaoFicha>
        )}
        {erro && <p className="erro-campo" role="alert">{erro}</p>}
      </form>
    </ModalFicha>
  );
}

function ModalConsultarAtualizacao({
  campanha,
  atualizacao,
  aoFechar,
}: {
  campanha: CampanhaPesquisador;
  atualizacao: AtualizacaoCampanha;
  aoFechar: () => void;
}) {
  return (
    <ModalFicha titulo="Consultar atualização" subtitulo={campanha.titulo} aoFechar={aoFechar}>
      <SecaoFicha titulo="Publicação">
        <CampoFicha rotulo="Título" valor={atualizacao.titulo} />
        <CampoFicha rotulo="Publicada em" valor={dataLegivel(atualizacao.data)} />
        <CampoFicha rotulo="Fase" valor={ROTULO_FASE[atualizacao.fase]} />
        <CampoFicha rotulo="Formato" valor={ROTULO_TIPO_ATUALIZACAO[atualizacao.tipo]} />
        <CampoFicha rotulo="Anexos e links" valor={[...(atualizacao.anexos ?? []).map((anexo) => anexo.nome), ...(atualizacao.url ? [atualizacao.url] : [])].join(', ') || 'Nenhum'} largura="cheia" />
        <CampoFicha rotulo="Mensagem completa" valor={atualizacao.mensagem} largura="cheia" />
      </SecaoFicha>
    </ModalFicha>
  );
}

function ModalConsultarComentario({
  campanha,
  comentario,
  aoFechar,
  aoAlternarEndosso,
  podeEndossar,
}: {
  campanha: CampanhaPesquisador;
  comentario: ComentarioCampanha;
  aoFechar: () => void;
  aoAlternarEndosso: () => void;
  podeEndossar: boolean;
}) {
  return (
    <ModalFicha
      titulo="Consultar comentário"
      subtitulo={campanha.titulo}
      aoFechar={aoFechar}
      rodape={
        <RodapeAcoes
          aoCancelar={aoFechar}
          rotuloCancelar="Fechar"
          acao={{
            rotulo: comentario.endossado ? 'Remover endosso' : 'Endossar comentário',
            aoClicar: aoAlternarEndosso,
            desabilitado: !comentario.endossado && !podeEndossar,
          }}
        />
      }
    >
      <SecaoFicha titulo="Comentário">
        <CampoFicha rotulo="Autor" valor={comentario.autor} />
        <CampoFicha rotulo="Enviado em" valor={dataLegivel(comentario.criadoEm)} />
        <CampoFicha rotulo="Situação" valor={comentario.endossado ? `Endossado (#${comentario.ordemEndosso ?? '—'})` : 'Aguardando endosso'} />
        <CampoFicha rotulo="Texto completo" valor={comentario.texto} largura="cheia" />
        {!comentario.endossado && !podeEndossar && (
          <p className="text-sm texto-fraco" role="status">O limite de {LIMITE_ENDOSSOS_CAMPANHA} endossos ativos desta campanha foi atingido.</p>
        )}
      </SecaoFicha>
    </ModalFicha>
  );
}

export function GerenciadorCampanhas({ campanhas, aoAlterar, aoCriarCampanha }: GerenciadorCampanhasProps) {
  const [secao, setSecao] = useState<SecaoGerenciador>('campanhas');
  const [campanhaConsultada, setCampanhaConsultada] = useState<CampanhaPesquisador | null>(null);
  const [campanhaEditada, setCampanhaEditada] = useState<CampanhaPesquisador | null>(null);
  const [recompensaEditada, setRecompensaEditada] = useState<{ campanhaId: string; recompensa?: RecompensaCampanha } | null>(null);
  const [atualizacaoEditada, setAtualizacaoEditada] = useState<{ campanhaId: string; atualizacao?: AtualizacaoCampanha } | null>(null);
  const [atualizacaoConsultada, setAtualizacaoConsultada] = useState<{ campanhaId: string; atualizacao: AtualizacaoCampanha } | null>(null);
  const [comentarioConsultado, setComentarioConsultado] = useState<{ campanhaId: string; comentario: ComentarioCampanha } | null>(null);

  function substituirCampanha(atualizada: CampanhaPesquisador) {
    aoAlterar(campanhas.map((item) => item.id === atualizada.id ? atualizada : item));
  }

  function gravarRecompensa(campanhaId: string, recompensa: RecompensaCampanha) {
    aoAlterar(campanhas.map((campanha) => campanha.id !== campanhaId ? campanha : {
      ...campanha,
      recompensas: [
        ...campanha.recompensas.filter((item) => item.id !== recompensa.id),
        recompensa,
      ],
    }));
    setRecompensaEditada(null);
  }

  function gravarAtualizacao(campanhaId: string, atualizacao: AtualizacaoCampanha) {
    aoAlterar(campanhas.map((campanha) => campanha.id !== campanhaId ? campanha : {
      ...campanha,
      atualizacoes: [
        ...campanha.atualizacoes.filter((item) => item.id !== atualizacao.id),
        atualizacao,
      ],
    }));
    setAtualizacaoEditada(null);
  }

  function alternarEndosso(campanha: CampanhaPesquisador, comentario: ComentarioCampanha) {
    const endossosAtivos = campanha.comentarios.filter((item) => item.endossado && item.ativo !== false);
    if (!comentario.endossado && endossosAtivos.length >= LIMITE_ENDOSSOS_CAMPANHA) return;
    const novaOrdem = comentario.endossado
      ? undefined
      : Math.max(0, ...endossosAtivos.map((item) => item.ordemEndosso ?? 0)) + 1;
    substituirCampanha({
      ...campanha,
      comentarios: campanha.comentarios.map((item) => item.id !== comentario.id ? item : {
        ...item,
        endossado: !item.endossado,
        ordemEndosso: novaOrdem,
      }),
    });
    setComentarioConsultado(null);
  }

  const recompensas = campanhas.flatMap((campanha) => campanha.recompensas.map((recompensa) => ({ campanha, recompensa })));
  const atualizacoes = campanhas.flatMap((campanha) => campanha.atualizacoes.map((atualizacao) => ({ campanha, atualizacao })));
  const comentarios = campanhas.flatMap((campanha) => campanha.comentarios.map((comentario) => ({ campanha, comentario })));
  const contribuicoes = campanhas.flatMap((campanha) => campanha.contribuicoes.map((contribuicao) => ({ campanha, contribuicao })));
  const tituloSecao = ITENS_MENU.find((item) => item.id === secao)?.rotulo ?? 'Campanhas';

  function renderCampanhas() {
    return (
      <>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="subtitulo texto-forte">Campanhas</h2>
            <p className="mt-1 text-sm texto-fraco">Consulte e gerencie os projetos que você cadastrou.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={aoCriarCampanha}><i className="fa-solid fa-plus mr-2" aria-hidden="true"></i>Nova campanha</button>
        </div>
        {campanhas.length === 0 ? <EstadoVazio icone="fa-flask" titulo="Nenhuma campanha cadastrada." texto="Crie uma campanha para começar a compartilhar sua pesquisa." /> : (
          <Tabela rotulo="Campanhas cadastradas" colunas={['Capa', 'Campanha', 'Estado', 'Lançamento', 'Encerramento', 'Modalidade', 'Meta', 'Ações']}>
            {campanhas.map((campanha) => (
              <tr key={campanha.id}>
                <td>
                  <div className="relative h-14 w-20 overflow-hidden rounded-lg fundo-sutil">
                    <img src={campanha.capaUrl} alt={`Capa de ${campanha.titulo}`} className="h-full w-full object-cover" />
                    {campanha.videoUrl && <span className="absolute inset-0 flex items-center justify-center texto-sobre-escuro" aria-label="Campanha com vídeo"><i className="fa-solid fa-circle-play" aria-hidden="true"></i></span>}
                  </div>
                </td>
                <td className="font-semibold texto-forte">{campanha.titulo}</td>
                <td><span className="badge badge-neutro">{ROTULO_STATUS[campanha.estado] ?? campanha.estado}</span></td>
                <td>{dataLegivel(campanha.dataInicio)}</td>
                <td>{dataLegivel(campanha.dataFim)}</td>
                <td>{ROTULO_MODALIDADE[campanha.modalidade] ?? campanha.modalidade}</td>
                <td className="whitespace-nowrap">{valorLegivel(campanha.meta)}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <BotaoAcao onClick={() => setCampanhaConsultada(campanha)}>Consultar</BotaoAcao>
                    {campanha.estado !== 'Em captação' && <BotaoAcao onClick={() => setCampanhaEditada(campanha)}>Editar</BotaoAcao>}
                  </div>
                </td>
              </tr>
            ))}
          </Tabela>
        )}
      </>
    );
  }

  function renderRecompensas() {
    return (
      <>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="subtitulo texto-forte">Recompensas</h2>
            <p className="mt-1 text-sm texto-fraco">Ofereça reconhecimento, acesso antecipado ou conteúdo digital, sempre a partir de uma contribuição mínima.</p>
          </div>
          {campanhas.length > 0 && <button type="button" className="btn btn-primary" onClick={() => setRecompensaEditada({ campanhaId: campanhas[0].id })}><i className="fa-solid fa-plus mr-2" aria-hidden="true"></i>Nova recompensa</button>}
        </div>
        {recompensas.length === 0 ? <EstadoVazio icone="fa-gift" titulo="Nenhuma recompensa cadastrada." texto="Cadastre uma recompensa vinculada a uma de suas campanhas." /> : (
          <Tabela rotulo="Recompensas das campanhas" colunas={['Campanha', 'Título', 'Tipo', 'A partir de', 'Escolhidas', 'Disponibilidade', 'Situação', 'Ações']}>
            {recompensas.map(({ campanha, recompensa }) => (
              <tr key={recompensa.id}>
                <td>{campanha.titulo}</td>
                <td className="font-semibold texto-forte">{recompensa.titulo}</td>
                <td>{ROTULO_RECOMPENSA[recompensa.tipo]}</td>
                <td className="whitespace-nowrap">{valorLegivel(recompensa.valorMinimo)}</td>
                <td>{recompensa.escolhidas}</td>
                <td>{recompensa.quantidadeDisponivel === null ? 'Ilimitada' : `${recompensa.quantidadeDisponivel} unidades`}</td>
                <td><span className={`badge ${recompensa.ativo ? 'badge-sucesso' : 'badge-neutro'}`}>{recompensa.ativo ? 'Ativa' : 'Desativada'}</span></td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <BotaoAcao onClick={() => setRecompensaEditada({ campanhaId: campanha.id, recompensa })}>Alterar</BotaoAcao>
                    <BotaoAcao onClick={() => substituirCampanha({ ...campanha, recompensas: campanha.recompensas.map((item) => item.id === recompensa.id ? { ...item, ativo: !item.ativo } : item) })}>
                      {recompensa.ativo ? 'Desativar' : 'Reativar'}
                    </BotaoAcao>
                  </div>
                </td>
              </tr>
            ))}
          </Tabela>
        )}
      </>
    );
  }

  function renderAtualizacoes() {
    return (
      <>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="subtitulo texto-forte">Atualizações</h2>
            <p className="mt-1 text-sm texto-fraco">Publique o andamento da pesquisa e registre os resultados.</p>
          </div>
          {campanhas.length > 0 && <button type="button" className="btn btn-primary" onClick={() => setAtualizacaoEditada({ campanhaId: campanhas[0].id })}><i className="fa-solid fa-plus mr-2" aria-hidden="true"></i>Nova atualização</button>}
        </div>
        {atualizacoes.length === 0 ? <EstadoVazio icone="fa-arrows-rotate" titulo="Nenhuma atualização publicada." texto="Adicione atualizações para compartilhar o progresso das campanhas." /> : (
          <Tabela rotulo="Atualizações das campanhas" colunas={['Campanha', 'Título', 'Fase', 'Formato', 'Publicada em', 'Situação', 'Ações']}>
            {atualizacoes.map(({ campanha, atualizacao }) => (
              <tr key={atualizacao.id}>
                <td>{campanha.titulo}</td>
                <td className="font-semibold texto-forte">{atualizacao.titulo}</td>
                <td>{ROTULO_FASE[atualizacao.fase]}</td>
                <td>{ROTULO_TIPO_ATUALIZACAO[atualizacao.tipo]}</td>
                <td>{dataLegivel(atualizacao.data)}</td>
                <td><span className={`badge ${atualizacao.ativo ? 'badge-sucesso' : 'badge-neutro'}`}>{atualizacao.ativo ? 'Publicada' : 'Ocultada'}</span></td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <BotaoAcao onClick={() => setAtualizacaoEditada({ campanhaId: campanha.id, atualizacao })}>Alterar</BotaoAcao>
                    <BotaoAcao onClick={() => setAtualizacaoConsultada({ campanhaId: campanha.id, atualizacao })}>Consultar</BotaoAcao>
                    <BotaoAcao onClick={() => substituirCampanha({ ...campanha, atualizacoes: campanha.atualizacoes.map((item) => item.id === atualizacao.id ? { ...item, ativo: !item.ativo } : item) })}>
                      {atualizacao.ativo ? 'Ocultar' : 'Reativar'}
                    </BotaoAcao>
                  </div>
                </td>
              </tr>
            ))}
          </Tabela>
        )}
      </>
    );
  }

  function renderComentarios() {
    return (
      <>
        <div className="mb-5">
          <h2 className="subtitulo texto-forte">Comentários</h2>
          <p className="mt-1 text-sm texto-fraco">Consulte o conteúdo e endosse no máximo {LIMITE_ENDOSSOS_CAMPANHA} comentários ativos por campanha.</p>
        </div>
        {comentarios.length === 0 ? <EstadoVazio icone="fa-comments" titulo="Nenhum comentário recebido." texto="Os comentários das campanhas aparecerão aqui." /> : (
          <Tabela rotulo="Comentários recebidos nas campanhas" colunas={['Campanha', 'Apoiador', 'Data', 'Comentário', 'Endosso', 'Ações']}>
            {comentarios.map(({ campanha, comentario }) => {
              const endossosAtivos = campanha.comentarios.filter((item) => item.endossado && item.ativo !== false).length;
              const bloqueado = !comentario.endossado && endossosAtivos >= LIMITE_ENDOSSOS_CAMPANHA;
              return (
                <tr key={comentario.id}>
                  <td>{campanha.titulo}</td>
                  <td>{comentario.autor}</td>
                  <td>{dataLegivel(comentario.criadoEm)}</td>
                  <td>{comentario.texto.length > 90 ? `${comentario.texto.slice(0, 90)}…` : comentario.texto}</td>
                  <td>{comentario.endossado ? <span className="badge badge-sucesso">#{comentario.ordemEndosso ?? '—'}</span> : <span className="badge badge-aviso">Pendente</span>}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <BotaoAcao onClick={() => setComentarioConsultado({ campanhaId: campanha.id, comentario })}>Consultar</BotaoAcao>
                      <BotaoAcao
                        onClick={() => alternarEndosso(campanha, comentario)}
                        disabled={bloqueado}
                        titulo={bloqueado ? `Limite de ${LIMITE_ENDOSSOS_CAMPANHA} endossos ativos atingido nesta campanha.` : undefined}
                      >
                        {comentario.endossado ? 'Remover endosso' : 'Endossar'}
                      </BotaoAcao>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Tabela>
        )}
      </>
    );
  }

  function renderContribuicoes() {
    return (
      <>
        <div className="mb-5">
          <h2 className="subtitulo texto-forte">Contribuições</h2>
          <p className="mt-1 text-sm texto-fraco">Acompanhe os apoios e a situação dos pagamentos das suas campanhas.</p>
        </div>
        {contribuicoes.length === 0 ? <EstadoVazio icone="fa-hand-holding-heart" titulo="Nenhuma contribuição recebida." texto="Os apoios das suas campanhas aparecerão aqui." /> : (
          <Tabela rotulo="Contribuições recebidas nas campanhas" colunas={['Data', 'Apoiador', 'Valor', 'Status do pagamento', 'Forma de pagamento', 'Campanha / recompensa']}>
            {contribuicoes.map(({ campanha, contribuicao }) => {
              const recompensa = campanha.recompensas.find((item) => item.id === contribuicao.recompensaId);
              return (
                <tr key={contribuicao.id}>
                  <td>{dataLegivel(contribuicao.criadoEm)}</td>
                  <td>{contribuicao.apoiador}</td>
                  <td className="whitespace-nowrap font-semibold texto-forte">{valorLegivel(contribuicao.valor)}</td>
                  <td>
                    <span className={`badge ${contribuicao.status === 'confirmado' || contribuicao.status === 'repassado' ? 'badge-sucesso' : contribuicao.status === 'pendente' ? 'badge-aviso' : 'badge-neutro'}`}>
                      {ROTULO_STATUS_CONTRIBUICAO[contribuicao.status] ?? contribuicao.status}
                    </span>
                  </td>
                  <td>{ROTULO_PAGAMENTO[contribuicao.pagamento] ?? contribuicao.pagamento}</td>
                  <td>{campanha.titulo}<span className="block text-sm texto-fraco">{recompensa?.titulo ?? 'Sem recompensa'}</span></td>
                </tr>
              );
            })}
          </Tabela>
        )}
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="titulo-pagina texto-forte">Minhas campanhas</h1>
        <p className="mt-2 text-sm texto-fraco">Gerencie seus projetos, recompensas, atualizações e contribuições.</p>
      </div>
      <div className="painel-conta-shell">
        <aside className="painel-conta-sidebar" aria-label="Menu de gerenciamento de campanhas">
          <nav className="space-y-2">
            {ITENS_MENU.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`painel-conta-item ${secao === item.id ? 'painel-conta-item--ativo' : ''}`}
                aria-current={secao === item.id ? 'page' : undefined}
                onClick={() => setSecao(item.id)}
              >
                <span className="flex items-center gap-3"><i className={`fa-solid ${item.icone}`} aria-hidden="true"></i>{item.rotulo}</span>
                {item.id === 'comentarios' && comentarios.filter(({ comentario }) => !comentario.endossado).length > 0 && (
                  <span className="badge badge-aviso">{comentarios.filter(({ comentario }) => !comentario.endossado).length}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>
        <section className="painel-conta-area min-w-0" aria-labelledby="titulo-secao-gerenciador">
          <h2 id="titulo-secao-gerenciador" className="sr-only">{tituloSecao}</h2>
          {secao === 'campanhas' && renderCampanhas()}
          {secao === 'recompensas' && renderRecompensas()}
          {secao === 'atualizacoes' && renderAtualizacoes()}
          {secao === 'comentarios' && renderComentarios()}
          {secao === 'contribuicoes' && renderContribuicoes()}
        </section>
      </div>

      {campanhaConsultada && <ModalConsultarCampanha campanha={campanhaConsultada} aoFechar={() => setCampanhaConsultada(null)} />}
      {campanhaEditada && (
        <ModalEditarCampanha
          campanha={campanhaEditada}
          aoFechar={() => setCampanhaEditada(null)}
          aoSalvar={(campanha) => {
            substituirCampanha(campanha);
            setCampanhaEditada(null);
          }}
        />
      )}
      {recompensaEditada && (
        <ModalRecompensaCampanha
          campanhas={campanhas}
          campanhaInicial={recompensaEditada.campanhaId}
          recompensa={recompensaEditada.recompensa ? { ...recompensaEditada.recompensa, campanhaId: recompensaEditada.campanhaId } : undefined}
          aoFechar={() => setRecompensaEditada(null)}
          aoSalvar={gravarRecompensa}
        />
      )}
      {atualizacaoEditada && (
        <ModalAtualizacaoCampanha
          campanhas={campanhas}
          campanhaInicial={atualizacaoEditada.campanhaId}
          atualizacao={atualizacaoEditada.atualizacao ? { ...atualizacaoEditada.atualizacao, campanhaId: atualizacaoEditada.campanhaId } : undefined}
          aoFechar={() => setAtualizacaoEditada(null)}
          aoSalvar={gravarAtualizacao}
        />
      )}
      {atualizacaoConsultada && (() => {
        const campanha = campanhas.find((item) => item.id === atualizacaoConsultada.campanhaId);
        const atualizacao = campanha?.atualizacoes.find((item) => item.id === atualizacaoConsultada.atualizacao.id);
        return campanha && atualizacao
          ? <ModalConsultarAtualizacao campanha={campanha} atualizacao={atualizacao} aoFechar={() => setAtualizacaoConsultada(null)} />
          : null;
      })()}
      {comentarioConsultado && (() => {
        const campanha = campanhas.find((item) => item.id === comentarioConsultado.campanhaId);
        const comentario = campanha?.comentarios.find((item) => item.id === comentarioConsultado.comentario.id);
        if (!campanha || !comentario) return null;
        const limiteDisponivel = campanha.comentarios.filter((item) => item.endossado && item.ativo !== false).length < LIMITE_ENDOSSOS_CAMPANHA;
        return (
          <ModalConsultarComentario
            campanha={campanha}
            comentario={comentario}
            aoFechar={() => setComentarioConsultado(null)}
            aoAlternarEndosso={() => alternarEndosso(campanha, comentario)}
            podeEndossar={limiteDisponivel}
          />
        );
      })()}
    </>
  );
}
