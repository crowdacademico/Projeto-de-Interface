import { USUARIOS_FALSOS } from '../dados-falsos/1-usuarios.js';
import { entrarComo } from './4-autenticacao-falsa.js';
import { atualizarCabecalhoConta } from './7-cabecalho.js';
import { nav } from './24-roteador.js';
import { renderizarTelaMinhaConta } from './10-minha-conta.js';

const ATRASO_LOGIN_MS = 600;

export function inicializarFormularioLogin() {
  const form = document.getElementById('form-login');
  if (!form || form.dataset.inicializado) return;
  form.dataset.inicializado = 'true';

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const campoEmail = document.getElementById('campo-login-email');
    const caixaErro = document.getElementById('erro-login');
    const botao = document.getElementById('login-submeter');
    const botaoTexto = document.getElementById('login-submeter-texto');

    campoEmail.classList.remove('campo--erro');
    caixaErro.classList.add('hidden');
    botao.disabled = true;
    botaoTexto.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Entrando...';

    setTimeout(() => {
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const usuario = USUARIOS_FALSOS.find((u) => u.email.toLowerCase() === email);

      if (!usuario) {
        campoEmail.classList.add('campo--erro');
        caixaErro.textContent = 'E-mail não encontrado. Veja um e-mail válido em dados-falsos/1-usuarios.js.';
        caixaErro.classList.remove('hidden');
        botao.disabled = false;
        botaoTexto.textContent = 'Entrar';
        return;
      }

      entrarComo(usuario.idUsuario);
      atualizarCabecalhoConta();

      renderizarTelaMinhaConta();
      nav('home');
      botao.disabled = false;
      botaoTexto.textContent = 'Entrar';
    }, ATRASO_LOGIN_MS);
  });
}
