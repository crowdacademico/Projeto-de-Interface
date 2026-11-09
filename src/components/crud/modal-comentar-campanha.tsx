// O modal situa o comentário no contexto da campanha e explica o fluxo de endosso.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { ModalFicha } from '@restrita/components/crud/modal-ficha';
import { Campo } from '@restrita/components/input/campo';
import { RodapeAcoes } from './rodape-acoes';

interface ComentarioCampanha {
  campanha: string;
  texto: string;
  estado: string;
}

interface ModalComentarCampanhaProps {
  campanha: string;
  comentarios: ComentarioCampanha[];
  podeComentar: boolean;
  aoEnviar: (texto: string) => void;
}

export function ModalComentarCampanha({
  campanha,
  comentarios,
  podeComentar,
  aoEnviar,
}: ModalComentarCampanhaProps) {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState('');
  const [erro, setErro] = useState('');

  function fechar() {
    setAberto(false);
    setTexto('');
    setErro('');
  }

  function submeter(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const comentario = texto.trim();
    if (!comentario) {
      setErro('Escreva um comentário antes de enviar.');
      return;
    }
    aoEnviar(comentario);
    fechar();
  }

  return (
    <>
      <section className="mt-8 rounded-xl border borda-padrao fundo-cartao p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="subtitulo texto-forte">Comentários da comunidade</h2>
            <p className="mt-1 text-sm texto-fraco">Comentários ficam públicos depois do endosso do pesquisador responsável.</p>
          </div>
          {podeComentar
            ? <button type="button" className="btn btn-primary" onClick={() => setAberto(true)}>Comentar nesta campanha</button>
            : <p className="text-sm texto-fraco">O comentário nesta campanha está disponível para pesquisadores cadastrados.</p>}
        </div>
        <ul className="mt-5 space-y-3">
          {comentarios.filter((comentario) => comentario.campanha === campanha).map((comentario, indice) => (
            <li key={`${comentario.texto}-${indice}`} className="rounded-lg border borda-padrao p-4">
              <p className="text-sm texto-padrao">{comentario.texto}</p>
              <span className="mt-2 inline-flex badge badge-aviso">{comentario.estado}</span>
            </li>
          ))}
          {!comentarios.some((comentario) => comentario.campanha === campanha) && (
            <li className="text-sm texto-fraco">Ainda não há comentários nesta campanha.</li>
          )}
        </ul>
      </section>
      {aberto && (
        <ModalFicha
          titulo="Comentar nesta campanha"
          subtitulo={campanha}
          aoFechar={fechar}
          rodape={
            <RodapeAcoes>
              <button type="button" className="btn btn-secondary" onClick={fechar}>Cancelar</button>
              <button type="submit" form="form-comentar-campanha-publica" className="btn btn-primary">Enviar comentário</button>
            </RodapeAcoes>
          }
        >
          <form id="form-comentar-campanha-publica" onSubmit={submeter} className="space-y-4">
            <Campo rotulo="Seu comentário" dica="O comentário ficará pendente até o endosso do pesquisador responsável.">
              {({ atributos, classeErro }) => (
                <textarea {...atributos} rows={5} maxLength={1000} required value={texto} onChange={(evento) => setTexto(evento.target.value)} className={'input-padrao' + classeErro} placeholder="Escreva uma pergunta ou contribuição construtiva." />
              )}
            </Campo>
            {erro && <p className="erro-campo" role="alert">{erro}</p>}
          </form>
        </ModalFicha>
      )}
    </>
  );
}
