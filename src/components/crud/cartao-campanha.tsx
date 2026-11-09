// O cartão apresenta os dados centrais de uma campanha em catálogos e prévias.
import type { CSSProperties, MouseEvent } from 'react';
import type { CampanhaCardData } from '../../types/cartao-campanha';
import { SeloModeloFinanciamento } from './selo-modelo-financiamento';

interface CartaoCampanhaProps {
  campanha: CampanhaCardData;
  seguindo: boolean;
  onAbrir: () => void;
  onAlternarSeguir: (evento: MouseEvent<HTMLButtonElement>, id: number) => void;
}

export function CartaoCampanha({
  campanha,
  seguindo,
  onAbrir,
  onAlternarSeguir,
}: CartaoCampanhaProps) {
  const emBreve = campanha.status === 'em-breve';
  const id = campanha.id ?? -1;

  return (
    <article
      role="group"
      tabIndex={0}
      aria-label={`Projeto: ${campanha.title}`}
      className="cartao-campanha fundo-cartao rounded-xl border borda-padrao overflow-hidden hover:shadow-2xl transition-all cursor-pointer flex flex-col group hover:-translate-y-1"
      onClick={onAbrir}
      onKeyDown={(evento) => {
        if (evento.target !== evento.currentTarget) return;
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          onAbrir();
        }
      }}
    >
      <div className="cartao-campanha__capa relative overflow-hidden bg-[var(--cor-tinta-900)]">
        <img
          src={campanha.image}
          alt={campanha.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:saturate-125 group-hover:opacity-100 transition-all duration-700"
        />
        <button
          type="button"
          onClick={(evento) => {
            evento.stopPropagation();
            onAlternarSeguir(evento, id);
          }}
          aria-pressed={seguindo}
          aria-label={seguindo ? 'Deixar de seguir este projeto' : 'Seguir este projeto'}
          className={`botao-seguir ${seguindo ? 'botao-seguir--ativo' : ''}`}
        >
          <i className={`${seguindo ? 'fa-solid' : 'fa-regular'} fa-heart`} />
        </button>
        <SeloModeloFinanciamento
          modelo={campanha.modelo}
          className={`absolute top-3 right-3 backdrop-blur-sm ${campanha.badgeClasses} px-3 py-1.5 rounded-full`}
        />
      </div>

      <div className="cartao-campanha__corpo p-4 flex-1 flex flex-col">
        <span className="cartao-campanha__instituicao microrrotulo texto-fraco mb-1.5 block">
          {campanha.institution} · {campanha.uf}
        </span>
        <h3 className="cartao-campanha__titulo subtitulo texto-forte leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {campanha.title}
        </h3>
        <p className="cartao-campanha__descricao legenda mb-3 line-clamp-1">
          {campanha.description}
        </p>
        <div className="cartao-campanha__pesquisador flex items-center gap-3 mb-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center legenda font-bold border shrink-0 ${campanha.avatarClasses}`}
          >
            {campanha.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-corpo-pequeno font-bold texto-padrao flex items-center gap-1">
              <span className="truncate">{campanha.researcher}</span>
              <i className="fa-solid fa-circle-check text-primary text-microrrotulo shrink-0" />
            </div>
            <div className="legenda truncate">{campanha.category}</div>
          </div>
        </div>

        <div className="cartao-campanha__detalhes mt-auto">
          {emBreve ? (
            <div className="flex items-center gap-3 rounded-lg fundo-institucional-sutil texto-institucional p-3">
              <i className="fa-regular fa-clock text-lg shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-sm block">
                  Início em {campanha.diasParaInicio} dia{campanha.diasParaInicio === 1 ? '' : 's'}
                </span>
                <span className="paragrafo-denso">
                  Meta: R$ {campanha.meta.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-1.5">
                <span className="numero numero--kpi texto-forte">{campanha.value}</span>
                <span className="paragrafo-denso texto-fraco">{campanha.progressLabel}</span>
              </div>
              <div
                className="cartao-campanha__progresso mb-3"
                style={{
                  '--progresso': `${Math.max(
                    0,
                    Math.min(100, Math.round((campanha.valorArrecadado / campanha.meta) * 100)),
                  )}%`,
                } as CSSProperties & { '--progresso': string }}
              >
                <div
                  className={`escala-progresso escala-progresso--compacta escala-progresso--${campanha.modelo}`}
                  role="progressbar"
                  aria-valuenow={Math.round((campanha.valorArrecadado / campanha.meta) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${campanha.progressLabel} arrecadados`}
                >
                  <div className="escala-progresso__trilho">
                    <div className="escala-progresso__preenchimento" />
                    <div className="escala-progresso__marca-meta" />
                    <span className="microrrotulo texto-fraco escala-progresso__rotulo-meta">Meta</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center legenda">
                <span className="fundo-realce px-2 py-1 rounded-md">
                  <i className="fa-solid fa-users mr-1" /> {campanha.supportLabel}
                </span>
                <span className="fundo-realce px-2 py-1 rounded-md">
                  <i className="fa-regular fa-clock mr-1" /> {campanha.timeLabel}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
