// A ficha mantém os dados em leitura e abre o modal apenas para editar campos permitidos.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { CampoFicha, SecaoFicha } from '@restrita/components/crud/ficha-consulta';
import { ModalFicha } from '@restrita/components/crud/modal-ficha';
import { RodapeAcoes } from '@restrita/components/crud/rodape-acoes';
import { Campo } from '@restrita/components/input/campo';

interface PerfilContaPublicaProps {
  dados: {
    nome: string;
    email: string;
    membroDesde: string;
    foto: string;
    pesquisador?: {
      cpfMascarado: string;
      tituloAcademico: string;
      tipoVinculo: string;
      instituicao: string;
      statusPesquisador: string;
      scoreAtual: number;
      chavePixMascarada: string;
      tipoChavePix: string;
    };
  };
  aoSalvar: (dados: {
    nome: string;
    foto: string;
    pesquisador?: {
      tituloAcademico: string;
      tipoVinculo: string;
      instituicao: string;
      chavePixMascarada: string;
      tipoChavePix: string;
    };
  }) => void;
}

export function PerfilContaPublica({ dados, aoSalvar }: PerfilContaPublicaProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState(dados.nome);
  const [foto, setFoto] = useState(dados.foto);
  const [tituloAcademico, setTituloAcademico] = useState(dados.pesquisador?.tituloAcademico || 'Graduado');
  const [tipoVinculo, setTipoVinculo] = useState(dados.pesquisador?.tipoVinculo || 'institucional');
  const [instituicao, setInstituicao] = useState(dados.pesquisador?.instituicao || '');
  const [chavePix, setChavePix] = useState('');
  const [erroFoto, setErroFoto] = useState('');

  function fecharModal() {
    setModalAberto(false);
    setNome(dados.nome);
    setFoto(dados.foto);
    setTituloAcademico(dados.pesquisador?.tituloAcademico || 'Graduado');
    setTipoVinculo(dados.pesquisador?.tipoVinculo || 'institucional');
    setInstituicao(dados.pesquisador?.instituicao || '');
    setChavePix('');
    setErroFoto('');
  }

  function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (nome.trim().length < 2) return;
    const pix = chavePix.trim();
    aoSalvar({
      nome: nome.trim(),
      foto,
      ...(dados.pesquisador ? {
        pesquisador: {
          tituloAcademico,
          tipoVinculo,
          instituicao: tipoVinculo === 'institucional' ? instituicao.trim() : '',
          chavePixMascarada: pix ? `${'*'.repeat(Math.max(4, Math.min(pix.length - 4, 10)))}${pix.slice(-4)}` : dados.pesquisador.chavePixMascarada,
          tipoChavePix: pix ? (pix.includes('@') ? 'E-mail' : /^\d+$/.test(pix) ? 'CPF/telefone' : 'Chave Pix') : dados.pesquisador.tipoChavePix,
        },
      } : {}),
    });
    setChavePix('');
    setModalAberto(false);
  }

  function selecionarFoto(arquivo?: File) {
    setErroFoto('');
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/') || arquivo.size > 2 * 1024 * 1024) {
      setErroFoto('Escolha uma imagem de até 2 MB.');
      return;
    }
    const leitor = new FileReader();
    leitor.addEventListener('load', () => {
      if (typeof leitor.result === 'string') setFoto(leitor.result);
      else setErroFoto('Não foi possível carregar a imagem.');
    });
    leitor.addEventListener('error', () => setErroFoto('Não foi possível ler o arquivo de imagem.'));
    leitor.readAsDataURL(arquivo);
  }

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-xl border borda-padrao fundo-cartao p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="subtitulo texto-forte">Dados pessoais</h2>
              <p className="mt-1 text-sm texto-fraco">Informações da sua conta pública.</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => setModalAberto(true)}>
              <i className="fa-solid fa-pen mr-2" aria-hidden="true"></i>Editar perfil
            </button>
          </div>
          <SecaoFicha titulo="Conta" nivel={3}>
            <CampoFicha rotulo="Nome de exibição" valor={dados.nome} />
            <CampoFicha rotulo="E-mail" valor={dados.email} />
            <CampoFicha rotulo="Membro desde" valor={dados.membroDesde} />
            <CampoFicha rotulo="Foto de perfil" valor={dados.foto ? 'Foto personalizada' : 'Avatar padrão'} />
          </SecaoFicha>
        </section>

        {dados.pesquisador && (
          <section className="rounded-xl border borda-padrao fundo-cartao p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="subtitulo texto-forte">Dados do perfil acadêmico</h2>
              <p className="mt-1 text-sm texto-fraco">Dados acadêmicos e de recebimento das suas campanhas.</p>
            </div>
            <div className="space-y-6">
              <SecaoFicha titulo="Identificação acadêmica" nivel={3}>
                <CampoFicha rotulo="CPF cadastrado" valor={dados.pesquisador.cpfMascarado} />
                <CampoFicha rotulo="Título acadêmico" valor={dados.pesquisador.tituloAcademico} />
                <CampoFicha rotulo="Tipo de vínculo" valor={dados.pesquisador.tipoVinculo} />
                <CampoFicha rotulo="Instituição" valor={dados.pesquisador.instituicao} />
                <CampoFicha rotulo="Status do perfil" valor={dados.pesquisador.statusPesquisador} />
                <CampoFicha rotulo="Score atual" valor={dados.pesquisador.scoreAtual} />
              </SecaoFicha>
              <SecaoFicha titulo="Recebimento por Pix" nivel={3}>
                <CampoFicha rotulo="Chave cadastrada" valor={`${dados.pesquisador.tipoChavePix} · ${dados.pesquisador.chavePixMascarada}`} />
                <CampoFicha rotulo="Proteção" valor="A chave completa não é exibida nesta página." />
              </SecaoFicha>
            </div>
          </section>
        )}
      </div>

      {modalAberto && (
        <ModalFicha
          titulo="Editar perfil"
          subtitulo="Altere somente os dados que podem ser atualizados por você."
          aoFechar={fecharModal}
          rodape={
            <RodapeAcoes
              aoCancelar={fecharModal}
              acao={{ rotulo: 'Salvar alterações', formulario: 'form-editar-perfil-publico' }}
            />
          }
        >
          <form id="form-editar-perfil-publico" onSubmit={salvar} className="space-y-6">
            <SecaoFicha titulo="Dados pessoais" nivel={3}>
              <Campo rotulo="Nome de exibição">
                {({ atributos, classeErro }) => (
                  <input {...atributos} required minLength={2} value={nome} onChange={(evento) => setNome(evento.target.value)} className={'input-padrao' + classeErro} />
                )}
              </Campo>
              <Campo rotulo="Nova foto de perfil" dica="Imagem de até 2 MB.">
                {({ atributos, classeErro }) => (
                  <input
                    {...atributos}
                    type="file"
                    accept="image/*"
                    onChange={(evento) => selecionarFoto(evento.target.files?.[0])}
                    className={'input-padrao' + classeErro}
                  />
                )}
              </Campo>
              {erroFoto && <p role="alert" className="erro-campo">{erroFoto}</p>}
            </SecaoFicha>

            {dados.pesquisador && (
              <>
                <SecaoFicha titulo="Dados do perfil acadêmico" nivel={3}>
                  <Campo rotulo="Título acadêmico">
                    {({ atributos, classeErro }) => (
                      <select {...atributos} value={tituloAcademico} onChange={(evento) => setTituloAcademico(evento.target.value)} className={'input-padrao' + classeErro}>
                        {['Graduado', 'Especialista', 'Mestre', 'Doutor'].map((titulo) => <option key={titulo}>{titulo}</option>)}
                      </select>
                    )}
                  </Campo>
                  <Campo rotulo="Tipo de vínculo">
                    {({ atributos, classeErro }) => (
                      <select {...atributos} value={tipoVinculo} onChange={(evento) => setTipoVinculo(evento.target.value)} className={'input-padrao' + classeErro}>
                        <option value="institucional">Institucional</option>
                        <option value="independente">Independente</option>
                      </select>
                    )}
                  </Campo>
                  {tipoVinculo === 'institucional' && (
                    <Campo rotulo="Instituição">
                      {({ atributos, classeErro }) => (
                        <input {...atributos} value={instituicao} onChange={(evento) => setInstituicao(evento.target.value)} className={'input-padrao' + classeErro} />
                      )}
                    </Campo>
                  )}
                </SecaoFicha>
                <SecaoFicha titulo="Recebimento por Pix" nivel={3}>
                  <Campo rotulo="Nova chave Pix" dica="Deixe vazio para manter a chave atual. A chave completa não será salva neste protótipo.">
                    {({ atributos, classeErro }) => (
                      <input {...atributos} value={chavePix} onChange={(evento) => setChavePix(evento.target.value)} autoComplete="off" className={'input-padrao' + classeErro} />
                    )}
                  </Campo>
                </SecaoFicha>
              </>
            )}
          </form>
        </ModalFicha>
      )}
    </>
  );
}
