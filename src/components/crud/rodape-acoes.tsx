// Um rodapé compartilhado organiza ações relacionadas sem retirar o controle de cada tela.
import type { ReactNode } from 'react';

interface RodapeAcoesProps {
  children: ReactNode;
  className?: string;
}

export function RodapeAcoes({ children, className = '' }: RodapeAcoesProps) {
  return (
    <footer className={`flex flex-col gap-3 border-t borda-padrao pt-6 sm:flex-row sm:justify-between ${className}`}>
      {children}
    </footer>
  );
}
