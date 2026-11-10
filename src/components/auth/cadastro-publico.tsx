// O cadastro público reúne os dados básicos da conta e, quando escolhido, os campos obrigatórios do perfil pesquisador.
import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { MensagemErro } from '@restrita/components/crud/mensagem-erro';
import { Campo } from '@restrita/components/input/campo';
import { CampoCpf } from '@restrita/components/input/campo-cpf';
import { BotaoMostrarSenha } from '@restrita/components/input/botao-mostrar-senha';
import { MedidorSenha } from '@restrita/components/input/medidor-senha';
import { ROTULO_TIPO_VINCULO, ROTULO_TITULO_ACADEMICO } from '@restrita/services/6-perfil-pesquisador/constants/status-pesquisador.constants';
import type { TipoVinculo, TituloAcademico } from '@restrita/services/6-perfil-pesquisador/constants/status-pesquisador.constants';
import { SENHA_MINIMO_CARACTERES } from '@restrita/services/3-auth/constants/senha.constants';
import { emailValido } from '@restrita/services/constant/util/validacao.util';
import { TIPOS_CONTA } from './cadastro.constants';
import type { TipoConta } from './cadastro.constants';
import { cpfValido } from './cadastro.util';

declare global {
  interface Window {
    nav: (view: string) => void;
  }
}

interface ErrosCadastro {
  nome?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
  cpf?: string;
  vinculoInstitucional?: string;
  aceiteTermos?: string;
  aceiteTermosPesquisador?: string;
}

const TITULOS_ACADEMICOS: TituloAcademico[] = ['graduado', 'especialista', 'mestre', 'doutor'];
const TIPOS_VINCULO: TipoVinculo[] = ['institucional', 'independente'];

export function CadastroPublico() {
  const idErroTermos = useId();
  const idErroTermosPesquisador = useId();
  const [passo, setPasso] = useState<1 | 2>(1);
  const [tipoConta, setTipoConta] = useState<TipoConta | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [cpf, setCpf] = useState('');
  const [tipoVinculo, setTipoVinculo] = useState<TipoVinculo>('institucional');
  const [vinculoInstitucional, setVinculoInstitucional] = useState('');
  const [tituloAcademico, setTituloAcademico] = useState<TituloAcademico>('mestre');
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [aceiteTermosPesquisador, setAceiteTermosPesquisador] = useState(false);
  const [erroTipoConta, setErroTipoConta] = useState('');
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [concluido, setConcluido] = useState(false);

  function avancar() {
    if (!tipoConta) {
      setErroTipoConta('Selecione como deseja usar a plataforma.');
      return;
    }
    setErroTipoConta('');
    setPasso(2);
  }

  function validar(): ErrosCadastro {
    const errosNovos: ErrosCadastro = {};
    if (!nome.trim() || nome.trim().length < 2) errosNovos.nome = 'Informe seu nome completo (mínimo de 2 caracteres).';
    if (!email.trim()) errosNovos.email = 'Informe o e-mail.';
    else if (!emailValido(email)) errosNovos.email = 'Informe um e-mail válido.';
    if (senha.length < SENHA_MINIMO_CARACTERES) {
      errosNovos.senha = `A senha precisa ter pelo menos ${SENHA_MINIMO_CARACTERES} caracteres.`;
    }
    if (!confirmarSenha) errosNovos.confirmarSenha = 'Confirme sua senha.';
    else if (senha !== confirmarSenha) errosNovos.confirmarSenha = 'As senhas não são iguais.';
    if (!aceiteTermos) errosNovos.aceiteTermos = 'É preciso aceitar os Termos de Uso para criar a conta.';

    if (tipoConta === 'pesquisador') {
      if (!cpfValido(cpf)) errosNovos.cpf = 'Informe um CPF válido.';
      if (tipoVinculo === 'institucional' && !vinculoInstitucional.trim()) {
        errosNovos.vinculoInstitucional = 'Informe a instituição.';
      }
      if (!aceiteTermosPesquisador) {
        errosNovos.aceiteTermosPesquisador = 'É preciso aceitar o Termo de Uso do pesquisador.';
      }
    }
    return errosNovos;
  }

  function cadastrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setTentouEnviar(true);
    const errosNovos = validar();
    if (Object.keys(errosNovos).length > 0) return;
    setConcluido(true);
  }

  const errosFormulario = tentouEnviar ? validar() : {};

  function renderizarCampoSenha(rotulo: string, valor: string, aoMudar: (valor: string) => void, erro?: string) {
    return (
      <Campo rotulo={rotulo} erro={tentouEnviar ? erro : undefined}>
        {({ atributos, classeErro }) => (
          <div className="relative">
            <input
              {...atributos}
              type={mostrarSenha ? 'text' : 'password'}
              value={valor}
              onChange={(evento) => aoMudar(evento.target.value)}
              autoComplete="new-password"
              className={'input-padrao pr-10' + classeErro}
            />
            <BotaoMostrarSenha mostrando={mostrarSenha} aoAlternar={() => setMostrarSenha((atual) => !atual)} />
          </div>
        )}
      </Campo>
    );
  }

  if (concluido) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 fundo-pagina py-16">
        <section className="max-w-lg w-full fundo-cartao rounded-2xl sombra-cartao-solto border borda-padrao p-8 text-center" aria-labelledby="titulo-cadastro-concluido">
          <div className="w-14 h-14 fundo-sucesso texto-sucesso rounded-full mx-auto mb-5 flex items-center justify-center">
            <i className="fa-solid fa-circle-check icone-destaque" aria-hidden="true"></i>
          </div>
          <h1 id="titulo-cadastro-concluido" className="titulo-secao mb-3">Cadastro simulado concluído</h1>
          <p className="paragrafo texto-fraco mb-6">
            {tipoConta === 'pesquisador'
              ? 'Os dados da conta e do perfil de pesquisador foram validados neste protótipo.'
              : 'Os dados da sua conta foram validados neste protótipo.'}
          </p>
          <button type="button" className="btn btn-primary" onClick={() => window.nav('login')}>Ir para o login</button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 fundo-pagina py-16">
      <section className="max-w-2xl w-full fundo-cartao rounded-2xl sombra-cartao-solto border borda-padrao overflow-hidden" aria-labelledby="titulo-cadastro">
        <header className="p-8 pb-0">
          <h1 id="titulo-cadastro" className="titulo-secao mb-1">Criar conta</h1>
          <p className="text-sm texto-fraco mb-6">
            Já tem conta? <button type="button" onClick={() => window.nav('login')} className="texto-marca font-bold hover:underline">Entrar</button>
          </p>
          <div className="flex items-center gap-2 mb-8" aria-label={`Etapa ${passo} de 2`}>
            {[1, 2].map((numero) => (
              <span
                key={numero}
                aria-current={passo === numero ? 'step' : undefined}
                className={`flex-1 h-1.5 rounded-full ${numero <= passo ? 'fundo-marca' : 'fundo-sutil'}`}
              />
            ))}
          </div>
        </header>

        {passo === 1 ? (
          <div className="px-8 pb-4">
            <h2 className="subtitulo texto-forte mb-4">Como você quer usar a plataforma?</h2>
            <div className="grid gap-4">
              {TIPOS_CONTA.map((tipo) => (
                <button
                  type="button"
                  key={tipo.chave}
                  aria-pressed={tipoConta === tipo.chave}
                  onClick={() => {
                    setTipoConta(tipo.chave);
                    setErroTipoConta('');
                  }}
                  className={`cartao text-left transition-all ${tipoConta === tipo.chave ? 'borda-marca' : ''}`}
                >
                  <span className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-lg fundo-marca-sutil texto-marca flex items-center justify-center">
                      <i className={`fa-solid ${tipo.icone}`} aria-hidden="true"></i>
                    </span>
                    <span className="subtitulo texto-forte">{tipo.titulo}</span>
                  </span>
                  <span className="block text-sm texto-padrao leading-relaxed">{tipo.descricao}</span>
                </button>
              ))}
            </div>
            {erroTipoConta && <p className="legenda enfase erro-campo mt-3" role="alert">{erroTipoConta}</p>}
            <div className="p-8 pb-4 px-0 flex justify-end">
              <button type="button" onClick={avancar} className="btn btn-primary">Continuar</button>
            </div>
          </div>
        ) : (
          <>
            <form id="form-cadastro-publico" onSubmit={cadastrar} noValidate className="px-8 pb-4 space-y-5">
              <p className="paragrafo texto-fraco">
                {tipoConta === 'pesquisador'
                  ? 'Informe seus dados de acesso e os dados necessários para criar seu perfil acadêmico.'
                  : 'Informe seus dados para criar sua conta de apoiador.'}
              </p>
              <MensagemErro texto={Object.keys(errosFormulario).length > 0 ? 'Revise os campos indicados para continuar.' : undefined} />

              <Campo rotulo="Nome completo" erro={errosFormulario.nome}>
                {({ atributos, classeErro }) => (
                  <input {...atributos} type="text" autoComplete="name" value={nome} onChange={(evento) => setNome(evento.target.value)} className={'input-padrao' + classeErro} />
                )}
              </Campo>

              <Campo rotulo="E-mail" erro={errosFormulario.email}>
                {({ atributos, classeErro }) => (
                  <input {...atributos} type="email" autoComplete="email" value={email} onChange={(evento) => setEmail(evento.target.value)} className={'input-padrao' + classeErro} />
                )}
              </Campo>

              {tipoConta === 'pesquisador' && (
                <div className="space-y-5">
                  <h2 className="titulo-bloco titulo-bloco--linha">Dados do perfil de pesquisador</h2>
                  <CampoCpf valor={cpf} onChange={setCpf} erro={errosFormulario.cpf} />
                  <Campo rotulo="Tipo de vínculo">
                    {({ atributos }) => (
                      <select {...atributos} value={tipoVinculo} onChange={(evento) => setTipoVinculo(evento.target.value as TipoVinculo)} className="input-padrao">
                        {TIPOS_VINCULO.map((tipo) => <option key={tipo} value={tipo}>{ROTULO_TIPO_VINCULO[tipo]}</option>)}
                      </select>
                    )}
                  </Campo>
                  {tipoVinculo === 'institucional' && (
                    <Campo rotulo="Instituição" erro={errosFormulario.vinculoInstitucional}>
                      {({ atributos, classeErro }) => (
                        <input {...atributos} type="text" maxLength={255} value={vinculoInstitucional} onChange={(evento) => setVinculoInstitucional(evento.target.value)} className={'input-padrao' + classeErro} />
                      )}
                    </Campo>
                  )}
                  <Campo rotulo="Título acadêmico">
                    {({ atributos }) => (
                      <select {...atributos} value={tituloAcademico} onChange={(evento) => setTituloAcademico(evento.target.value as TituloAcademico)} className="input-padrao">
                        {TITULOS_ACADEMICOS.map((titulo) => <option key={titulo} value={titulo}>{ROTULO_TITULO_ACADEMICO[titulo]}</option>)}
                      </select>
                    )}
                  </Campo>
                  <p className="legenda texto-fraco">
                    Links acadêmicos, como Lattes e ORCID, e a chave Pix podem ser informados depois, nas respectivas áreas do perfil.
                  </p>
                </div>
              )}

              {renderizarCampoSenha('Senha', senha, setSenha, errosFormulario.senha)}
              <MedidorSenha senha={senha} />
              {renderizarCampoSenha('Confirmar senha', confirmarSenha, setConfirmarSenha, errosFormulario.confirmarSenha)}

              <div className="space-y-2">
                <label className="paragrafo enfase flex items-start gap-2 texto-padrao">
                  <input
                    type="checkbox"
                    checked={aceiteTermos}
                    onChange={(evento) => setAceiteTermos(evento.target.checked)}
                    aria-invalid={Boolean(errosFormulario.aceiteTermos)}
                    aria-describedby={errosFormulario.aceiteTermos ? idErroTermos : undefined}
                    className="mt-0.5"
                  />
                  Li e aceito os Termos de Uso da plataforma.
                </label>
                {errosFormulario.aceiteTermos && <p id={idErroTermos} className="legenda enfase erro-campo" role="alert">{errosFormulario.aceiteTermos}</p>}
                {tipoConta === 'pesquisador' && (
                  <>
                    <label className="paragrafo enfase flex items-start gap-2 texto-padrao">
                      <input
                        type="checkbox"
                        checked={aceiteTermosPesquisador}
                        onChange={(evento) => setAceiteTermosPesquisador(evento.target.checked)}
                        aria-invalid={Boolean(errosFormulario.aceiteTermosPesquisador)}
                        aria-describedby={errosFormulario.aceiteTermosPesquisador ? idErroTermosPesquisador : undefined}
                        className="mt-0.5"
                      />
                      Li e aceito o Termo de Uso do pesquisador.
                    </label>
                    {errosFormulario.aceiteTermosPesquisador && <p id={idErroTermosPesquisador} className="legenda enfase erro-campo" role="alert">{errosFormulario.aceiteTermosPesquisador}</p>}
                  </>
                )}
              </div>
            </form>

            <footer className="p-8 pt-4 flex items-center justify-between gap-3">
              <button type="button" onClick={() => { setPasso(1); setTentouEnviar(false); }} className="btn btn-secondary">Voltar</button>
              <button type="submit" form="form-cadastro-publico" className="btn btn-primary">Criar conta</button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
