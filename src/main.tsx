import { createRoot } from 'react-dom/client';
import App from './App';

const elementoRaiz = document.getElementById('root');

if (!elementoRaiz) {
  throw new Error('Elemento #root não encontrado em index.html.');
}

createRoot(elementoRaiz).render(<App />);
