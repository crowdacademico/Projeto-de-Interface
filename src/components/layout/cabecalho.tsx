// O cabeçalho concentra navegação e controle de acesso em telas grandes e móveis.
import { useEffect, useState } from 'react';
import { ModalBase } from '../layout/modal-base';

const conteudo = String.raw`<header class="fundo-cartao border-b borda-forte sticky top-0 z-50 shadow-md relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" onclick="nav('home'); return false;" class="flex items-center gap-3 shrink-0">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-inner"><i class="fa-solid fa-flask"></i></div>
            <span class="font-bold text-2xl tracking-tight texto-forte hidden sm:block">CrowdAcadêmico</span>
        </a>

        <nav class="hidden lg:flex items-center gap-6 mx-6" aria-label="Navegação principal">
            <a href="#" data-view-nav="explorar" onclick="nav('explorar'); return false;" class="text-sm font-bold texto-padrao hover:text-primary transition-colors">Explorar</a>
            <a href="#" data-view-nav="como-funciona" onclick="nav('como-funciona'); return false;" class="text-sm font-bold texto-padrao hover:text-primary transition-colors">Como funciona</a>
            <a href="#" data-view-nav="sobre" onclick="nav('sobre'); return false;" class="text-sm font-bold texto-padrao hover:text-primary transition-colors">Sobre</a>
        </nav>

        <div class="flex items-center gap-3">
            <button onclick="nav('criar-campanha')" class="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-bold transition-all text-sm shadow-md hidden lg:block">Submeter Pesquisa</button>

            <button type="button" onclick="nav('notificacoes')" aria-label="Notificações" class="relative hidden sm:flex w-9 h-9 rounded-lg border borda-forte items-center justify-center texto-padrao hover-fundo-sutil transition-colors">
                <i class="fa-solid fa-bell"></i>
                <span id="badge-notificacoes" class="hidden absolute -top-1.5 -right-1.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full fundo-urgencia-sutil texto-urgencia text-microrrotulo flex items-center justify-center leading-none">0</span>
            </button>

            <div class="hidden sm:flex items-center border borda-forte rounded-lg overflow-hidden" role="group" aria-label="Tamanho da fonte">
                <button type="button" id="botao-fonte-diminuir" onclick="diminuirFonte()" class="px-2.5 py-1.5 text-xs font-bold texto-padrao hover-fundo-sutil transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent">A-</button>
                <button type="button" id="botao-fonte-aumentar" onclick="aumentarFonte()" class="px-2.5 py-1.5 text-xs font-bold texto-padrao hover-fundo-sutil transition-colors border-l borda-forte disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent">A+</button>
            </div>

            <button type="button" id="botao-tema" onclick="alternarTema()" class="w-9 h-9 rounded-lg border borda-forte flex items-center justify-center texto-padrao hover-fundo-sutil transition-colors"></button>

            <div id="menu-conta-container"></div>

            <button type="button" id="botao-menu-movel" onclick="abrirMenuMovel()" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-movel-gaveta" class="lg:hidden w-9 h-9 rounded-lg border borda-forte flex items-center justify-center texto-padrao hover-fundo-sutil transition-colors">
                <i class="fa-solid fa-bars"></i>
            </button>
        </div>
    </div>

</header>
`;

const conteudoMenuMovel = String.raw`
<div class="flex items-center justify-between p-5 border-b borda-padrao">
    <span class="font-bold texto-forte">Menu</span>
    <button type="button" onclick="fecharMenuMovel()" aria-label="Fechar menu" class="w-8 h-8 rounded-lg hover-fundo-sutil flex items-center justify-center texto-padrao"><i class="fa-solid fa-xmark"></i></button>
</div>
<nav class="flex flex-col p-5 gap-1" aria-label="Navegação principal (móvel)">
    <a href="#" data-view-nav="explorar" onclick="nav('explorar'); fecharMenuMovel(); return false;" class="py-3 px-2 rounded-lg font-bold texto-padrao hover-fundo-sutil">Explorar</a>
    <a href="#" data-view-nav="como-funciona" onclick="nav('como-funciona'); fecharMenuMovel(); return false;" class="py-3 px-2 rounded-lg font-bold texto-padrao hover-fundo-sutil">Como funciona</a>
    <a href="#" data-view-nav="sobre" onclick="nav('sobre'); fecharMenuMovel(); return false;" class="py-3 px-2 rounded-lg font-bold texto-padrao hover-fundo-sutil">Sobre</a>
    <a href="#" data-view-nav="notificacoes" onclick="nav('notificacoes'); fecharMenuMovel(); return false;" class="py-3 px-2 rounded-lg font-bold texto-padrao hover-fundo-sutil">Notificações</a>
    <a href="#" onclick="nav('criar-campanha'); fecharMenuMovel(); return false;" class="py-3 px-2 rounded-lg font-bold texto-marca hover-fundo-sutil">Submeter Pesquisa</a>
</nav>
<div class="flex items-center gap-3 p-5 border-t borda-padrao mt-auto">
    <div class="flex items-center border borda-forte rounded-lg overflow-hidden" role="group" aria-label="Tamanho da fonte">
        <button type="button" onclick="diminuirFonte()" class="px-2.5 py-1.5 text-xs font-bold texto-padrao hover-fundo-sutil transition-colors">A-</button>
        <button type="button" onclick="aumentarFonte()" class="px-2.5 py-1.5 text-xs font-bold texto-padrao hover-fundo-sutil transition-colors border-l borda-forte">A+</button>
    </div>
    <button type="button" onclick="alternarTema()" class="w-9 h-9 rounded-lg border borda-forte flex items-center justify-center texto-padrao hover-fundo-sutil"><i class="fa-solid fa-circle-half-stroke"></i></button>
</div>
`;

function MenuMovel() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const abrir = () => setAberto(true);
    const fechar = () => setAberto(false);
    window.addEventListener('menu-movel:abrir', abrir);
    window.addEventListener('menu-movel:fechar', fechar);
    return () => {
      window.removeEventListener('menu-movel:abrir', abrir);
      window.removeEventListener('menu-movel:fechar', fechar);
    };
  }, []);

  useEffect(() => {
    document.getElementById('botao-menu-movel')?.setAttribute('aria-expanded', String(aberto));
    if (aberto) document.querySelector<HTMLElement>('#menu-movel-gaveta nav a')?.focus();
  }, [aberto]);

  return (
    <ModalBase
      aberto={aberto}
      titulo="Menu de navegação"
      aoFechar={() => setAberto(false)}
      tamanho="gaveta"
      className="flex flex-col lg:hidden"
      classNameCamada="lg:hidden"
      id="menu-movel-gaveta"
    >
      <div dangerouslySetInnerHTML={{ __html: conteudoMenuMovel }} />
    </ModalBase>
  );
}

export function Cabecalho() {
  return (
    <>
      <div id="app-cabecalho" dangerouslySetInnerHTML={{ __html: conteudo }} />
      <MenuMovel />
    </>
  );
}
