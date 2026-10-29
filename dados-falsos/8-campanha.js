export const projectTabs = [
    {
        id: 'sobre',
        label: 'Sobre a Pesquisa',
        content: `
            <div class="space-y-6">
                <div>
                    <h2 class="text-xl font-black texto-forte mb-3">Por que esta pesquisa importa</h2>
                    <p class="texto-padrao leading-relaxed">Esta investigação mede a concentração de microplásticos em tecidos de peixes nativos e correlaciona os dados com sinais de estresse oxidativo e alterações metabólicas em ambientes impactados pela urbanização e agricultura intensiva.</p>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    <div class="rounded-xl border borda-padrao fundo-destaque p-5">
                        <div class="rotulo mb-2">Objetivo principal</div>
                        <div class="font-bold texto-forte">Mapear o risco ecológico e sanitário</div>
                    </div>
                    <div class="rounded-xl border borda-padrao fundo-destaque p-5">
                        <div class="rotulo mb-2">Impacto esperado</div>
                        <div class="font-bold texto-forte">Subsídios para políticas públicas de preservação fluvial</div>
                    </div>
                </div>
                <div class="rounded-xl border borda-padrao p-6">
                    <h2 class="text-lg font-black texto-forte mb-3">Fluxo metodológico</h2>
                    <ul class="space-y-3 texto-padrao">
                        <li><span class="font-semibold texto-forte">1.</span> Coleta de amostras e análise de ingestão em peixes de diferentes trechos do rio.</li>
                        <li><span class="font-semibold texto-forte">2.</span> Identificação por espectroscopia e validação em laboratório.</li>
                        <li><span class="font-semibold texto-forte">3.</span> Comparação entre espécies nativas e indicadores ambientais.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        id: 'cronograma',
        label: 'Cronograma',
        content: `
            <div class="rounded-xl border borda-padrao p-6">
                <h2 class="text-lg font-black texto-forte mb-5">Fases da pesquisa</h2>
                <div class="space-y-5">
                    <div class="flex items-start gap-4">
                        <span class="fundo-sucesso texto-sucesso microrrotulo px-2.5 py-1 rounded-full shrink-0 mt-0.5">Concluída</span>
                        <div>
                            <div class="font-bold texto-forte">Coleta de amostras</div>
                            <div class="text-sm texto-fraco">Fevereiro a março de 2026</div>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <span class="fundo-info texto-info microrrotulo px-2.5 py-1 rounded-full shrink-0 mt-0.5">Em andamento</span>
                        <div>
                            <div class="font-bold texto-forte">Identificação por espectroscopia e validação em laboratório</div>
                            <div class="text-sm texto-fraco">Abril a junho de 2026</div>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <span class="fundo-sutil texto-fraco microrrotulo px-2.5 py-1 rounded-full shrink-0 mt-0.5">Planejada</span>
                        <div>
                            <div class="font-bold texto-forte">Comparação entre espécies nativas e indicadores ambientais</div>
                            <div class="text-sm texto-fraco">Julho a agosto de 2026</div>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <span class="fundo-sutil texto-fraco microrrotulo px-2.5 py-1 rounded-full shrink-0 mt-0.5">Planejada</span>
                        <div>
                            <div class="font-bold texto-forte">Publicação dos resultados e relatório final</div>
                            <div class="text-sm texto-fraco">Setembro de 2026</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {

        id: 'orcamento',
        label: 'Orçamento',
        content: `<div id="orcamento-conteudo-campanha"></div>`
    },
    {
        id: 'atualizacoes',
        label: 'Atualizações',
        badge: '3',
        badgeClass: 'fundo-realce texto-padrao px-2 py-0.5 rounded-full text-microrrotulo font-bold',

        content: `<div id="campanha-linha-do-tempo"></div>`
    },
    {
        id: 'endossos',
        label: 'Endossos Acadêmicos',
        badge: '2',
        badgeClass: 'fundo-sucesso texto-sucesso px-2 py-0.5 rounded-full text-microrrotulo font-bold',
        content: `
            <div class="space-y-4">
                <div class="rounded-xl border borda-padrao p-5">
                    <div class="font-bold texto-forte">Prof. Dr. Renato Barros</div>
                    <div class="text-sm texto-fraco mt-1">Instituto de Biociências, UNESP</div>
                    <p class="text-sm texto-padrao mt-3">A proposta apresenta metodologia sólida e relevância direta para conservação de ecossistemas fluviais.</p>
                </div>
                <div class="rounded-xl border borda-padrao p-5">
                    <div class="font-bold texto-forte">Dra. Cíntia Mendes</div>
                    <div class="text-sm texto-fraco mt-1">Departamento de Saúde Pública, USP</div>
                    <p class="text-sm texto-padrao mt-3">A integração entre saúde ambiental e biodiversidade potencializa a aplicação dos resultados.</p>
                </div>
            </div>
        `
    }
];

export const projectSupportInfo = [
    {
        variant: 'default',
        title: 'Regras de pagamento',
        body: 'Contribuições anônimas são aceitas apenas via PIX. Cartão de crédito, débito e boleto estão disponíveis somente para usuários cadastrados e autenticados.'
    },
    {
        variant: 'list',
        title: 'Modelo de financiamento',
        items: [
            '<strong>Tudo ou Nada:</strong> se a meta não for atingida, as contribuições são estornadas ou não cobradas.',
            '<strong>Flexível:</strong> o valor arrecadado é mantido mesmo que a meta não seja alcançada.'
        ]
    },
    {
        variant: 'warning',
        title: 'Garantia Tudo ou Nada',
        body: 'Seu apoio só é efetivado (cobrado ou não devolvido) se o projeto atingir 100% da meta no prazo. Risco zero.'
    }
];

export const CAMPANHA_LINHA_DO_TEMPO = [
    { tipo: 'post', data: '02 fev 2026', autor: 'Dra. Marina Souza', titulo: 'Campanha publicada', corpo: 'Início da captação para o mapeamento de microplásticos no Rio Paraná.' },
    { tipo: 'marco', data: '18 fev 2026', titulo: 'Marco: 25% da meta atingida', corpo: 'R$ 8.750 arrecadados, primeira leva de apoiadores institucionais.' },
    { tipo: 'post', data: '05 mar 2026', autor: 'Dra. Marina Souza', titulo: 'Nova coleta realizada em março', corpo: 'Foram analisadas 24 amostras adicionais em área de maior pressão urbana.' },
    { tipo: 'marco', data: '22 mar 2026', titulo: 'Marco: 50% da meta atingida', corpo: 'R$ 17.500 arrecadados, mais da metade do caminho para viabilizar a pesquisa.' },
    { tipo: 'post', data: '10 abr 2026', autor: 'Dra. Marina Souza', titulo: 'Parceria com laboratório local', corpo: 'A equipe passou a contar com suporte de um laboratório parceiro para validação de espectros.' },
    { tipo: 'post', data: '02 mai 2026', autor: 'Dra. Marina Souza', titulo: 'Revisão do cronograma', corpo: 'A fase de análise segue dentro do previsto, sem impacto no prazo final.' }
];
