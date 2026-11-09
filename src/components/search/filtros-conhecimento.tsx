// Os filtros de grandes áreas e subáreas ficam agrupados para preservar a hierarquia.
import { GrupoFiltroExpansivel } from './grupo-filtro-expansivel';
import { GRANDES_AREAS_CONHECIMENTO, obterSubareas } from '../../data/areas-conhecimento';

interface FiltrosConhecimentoProps {
  grandesAreasSelecionadas: string[];
  subareasSelecionadas: string[];
  aoAlterarGrandesAreas: (values: string[]) => void;
  aoAlterarSubareas: (values: string[]) => void;
}

export function FiltrosConhecimento({
  grandesAreasSelecionadas,
  subareasSelecionadas,
  aoAlterarGrandesAreas,
  aoAlterarSubareas,
}: FiltrosConhecimentoProps) {
  return (
    <>
      <GrupoFiltroExpansivel
        titulo="Grandes áreas do conhecimento"
        opcoes={GRANDES_AREAS_CONHECIMENTO}
        valoresSelecionados={grandesAreasSelecionadas}
        aoAlterar={aoAlterarGrandesAreas}
      />
      <GrupoFiltroExpansivel
        titulo="Subáreas do conhecimento"
        opcoes={obterSubareas(grandesAreasSelecionadas)}
        valoresSelecionados={subareasSelecionadas}
        aoAlterar={aoAlterarSubareas}
        desabilitado={grandesAreasSelecionadas.length === 0}
        mensagemDesabilitado="Selecione uma grande área para filtrar por subárea."
      />
    </>
  );
}
