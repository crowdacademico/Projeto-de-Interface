export function cpfValido(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (digitos: string, quantidade: number) => {
    const soma = [...digitos.slice(0, quantidade)]
      .reduce((total, digito, indice) => total + Number(digito) * (quantidade + 1 - indice), 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return calcularDigito(cpf, 9) === Number(cpf[9]) && calcularDigito(cpf, 10) === Number(cpf[10]);
}
