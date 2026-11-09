// O campo mantém o valor monetário formatado sem perder o valor decimal usado pelo formulário.
import { useLayoutEffect, useState } from 'react';
import { Campo } from '@restrita/components/input/campo';
import { InputDinheiro } from '@restrita/components/input/input-dinheiro';

function obterErroMeta(valor: string) {
  if (!valor) return 'Informe a meta da campanha.';
  if (Number(valor) < 500) return 'A meta mínima é R$ 500,00.';
  return '';
}

interface CampoMetaCampanhaProps {
  valorInicial: string;
  aoMudarMeta: (valor: string) => void;
}

export function CampoMetaCampanha({ valorInicial, aoMudarMeta }: CampoMetaCampanhaProps) {
  const [valor, setValor] = useState(valorInicial);
  const [foiValidada, setFoiValidada] = useState(false);

  useLayoutEffect(() => {
    setValor(valorInicial);
    setFoiValidada(false);

    function atualizarValor(evento: Event) {
      if (evento instanceof CustomEvent && typeof evento.detail === 'string') {
        setValor(evento.detail);
        setFoiValidada(false);
      }
    }

    function validarMeta() {
      setFoiValidada(true);
    }

    window.addEventListener('criar-campanha:atualizar-meta', atualizarValor);
    window.addEventListener('criar-campanha:validar-meta', validarMeta);
    return () => {
      window.removeEventListener('criar-campanha:atualizar-meta', atualizarValor);
      window.removeEventListener('criar-campanha:validar-meta', validarMeta);
    };
  }, [valorInicial]);

  const erro = foiValidada ? obterErroMeta(valor) : '';

  return (
    <Campo rotulo="Meta (R$)" dica="Meta mínima: R$ 500,00." erro={erro} className="campo">
      {({ atributos, classeErro }) => (
        <InputDinheiro
          {...atributos}
          name="meta"
          required
          valor={valor}
          aoMudar={(novoValor) => {
            setValor(novoValor);
            aoMudarMeta(novoValor);
          }}
          onBlur={() => setFoiValidada(true)}
          className={`input-padrao${classeErro}`}
        />
      )}
    </Campo>
  );
}
