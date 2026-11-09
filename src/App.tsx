import { useEffect, useState } from 'react';
import { CabecalhoPagina } from './components/layout/cabecalho-pagina';
import { Cabecalho } from './components/layout/cabecalho';
import { NavFlutuante } from './components/layout/navegacao-flutuante';
import { Rodape } from './components/layout/rodape';
import { TelaApoioConfirmado } from './screens/ApoioConfirmado';
import { TelaAtualizacoes } from './screens/Atualizacoes';
import { TelaCadastro } from './screens/Cadastro';
import { TelaCampanha } from './screens/Campanha';
import { TelaCheckout } from './screens/Checkout';
import { TelaComoFunciona } from './screens/ComoFunciona';
import { TelaCriarCampanha } from './screens/CriarCampanha';
import { TelaExplorar } from './screens/Explorar';
import { TelaGuiaEstilos } from './screens/GuiaEstilos';
import { TelaHome } from './screens/Home';
import { TelaLogin } from './screens/Login';
import { TelaMinhaConta } from './screens/MinhaConta';
import { TelaNotificacoes } from './screens/Notificacoes';
import { TelaPerfilPesquisador } from './screens/PerfilPesquisador';
import { TelaSobre } from './screens/Sobre';
import { TelaTermos } from './screens/Termos';
import { TelaTransparencia } from './screens/Transparencia';

export default function App() {
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      try {
        await import('../js/0-script.js');
        const { inicializarApp } = await import('../js/24-roteador.js');
        await inicializarApp();
      } catch (erroInicializacao) {
        console.error('Falha ao inicializar a aplicação pública.', erroInicializacao);
        if (ativo) {
          setErro(
            erroInicializacao instanceof Error
              ? erroInicializacao.message
              : String(erroInicializacao),
          );
        }
      }
    }

    void inicializar();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="w-full min-h-0">
      {erro && (
        <div className="p-8 text-center text-red-600" role="alert">
          Falha ao carregar o protótipo: {erro}
        </div>
      )}
      <a href="#app" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <CabecalhoPagina />
      <NavFlutuante />

      <div id="app" className="w-full min-h-0">
        <TelaHome />
        <TelaExplorar />
        <TelaGuiaEstilos />
        <TelaComoFunciona />
        <TelaPerfilPesquisador />
        <TelaSobre />
        <TelaTransparencia />
        <TelaCadastro />
        <TelaAtualizacoes />
        <TelaTermos />
        <TelaNotificacoes />
        <TelaMinhaConta />
        <TelaCampanha />
        <TelaCheckout />
        <TelaApoioConfirmado />
        <TelaLogin />
        <TelaCriarCampanha />
      </div>

      <Rodape />
      <div id="app-avisos" className="pilha-avisos" role="status" aria-live="polite" />
    </div>
  );
}
