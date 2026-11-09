// O modal mantém a troca de senha fora da tela de segurança até a pessoa solicitar a ação.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { ModalFicha } from '@restrita/components/crud/modal-ficha';
import { RodapeAcoes } from './rodape-acoes';
import { Campo } from '@restrita/components/input/campo';

interface ModalAlterarSenhaProps {
  aoSalvar: () => void;
}

export function ModalAlterarSenha({ aoSalvar }: ModalAlterarSenhaProps) {
  const [aberto, setAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');

  function fechar() {
    setAberto(false);
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmacao('');
    setErro('');
  }

  function submeter(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!senhaAtual || novaSenha.length < 8 || novaSenha !== confirmacao) {
      setErro('Informe a senha atual e uma nova senha de pelo menos oito caracteres que corresponda à confirmação.');
      return;
    }
    aoSalvar();
    fechar();
  }

  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={() => setAberto(true)}>
        Alterar senha
      </button>
      {aberto && (
        <ModalFicha
          titulo="Alterar senha"
          subtitulo="Escolha uma senha exclusiva com pelo menos oito caracteres."
          aoFechar={fechar}
          rodape={
            <RodapeAcoes>
              <button type="button" className="btn btn-secondary" onClick={fechar}>Cancelar</button>
              <button type="submit" form="form-alterar-senha-publica" className="btn btn-primary">Salvar nova senha</button>
            </RodapeAcoes>
          }
        >
          <form id="form-alterar-senha-publica" onSubmit={submeter} className="space-y-4">
            <Campo rotulo="Senha atual">
              {({ atributos, classeErro }) => (
                <input {...atributos} type="password" autoComplete="current-password" required value={senhaAtual} onChange={(evento) => setSenhaAtual(evento.target.value)} className={'input-padrao' + classeErro} />
              )}
            </Campo>
            <Campo rotulo="Nova senha" dica="Use pelo menos oito caracteres.">
              {({ atributos, classeErro }) => (
                <input {...atributos} type="password" autoComplete="new-password" minLength={8} required value={novaSenha} onChange={(evento) => setNovaSenha(evento.target.value)} className={'input-padrao' + classeErro} />
              )}
            </Campo>
            <Campo rotulo="Confirmar nova senha">
              {({ atributos, classeErro }) => (
                <input {...atributos} type="password" autoComplete="new-password" minLength={8} required value={confirmacao} onChange={(evento) => setConfirmacao(evento.target.value)} className={'input-padrao' + classeErro} />
              )}
            </Campo>
            {erro && <p className="erro-campo" role="alert">{erro}</p>}
          </form>
        </ModalFicha>
      )}
    </>
  );
}
