export const USUARIOS_FALSOS = [
  {
    idUsuario: 1,
    nome: 'Usuário Comum',
    email: 'usuario@crowdacademico.com.br',
    papeis: ['usuario'],
    emailVerificado: true,
    criadoEm: '2026-04-12T14:30:00',
    ultimoLoginEm: '2026-08-17T09:05:00',
  },
  {
    idUsuario: 2,
    nome: 'Pesquisador',
    email: 'pesquisador@crowdacademico.com.br',
    papeis: ['pesquisador', 'usuario'],
    emailVerificado: true,
    criadoEm: '2026-03-01T10:00:00',
    ultimoLoginEm: '2026-08-17T09:05:00',
    perfilPesquisador: {
      instituicao: 'Unicamp',
      areaConhecimento: 'Ciência da Computação',
      tituloAcademico: 'Doutor',
      tipoVinculo: 'institucional',
      statusPesquisador: 'ativo',
      cpfMascarado: '***.456.789-**',
      scoreAtual: 87,
    },
  },
  {
    idUsuario: 3,
    nome: 'Administrador',
    email: 'admin@crowdacademico.com.br',
    papeis: ['usuario', 'administrador'],
    emailVerificado: true,
    criadoEm: '2026-02-10T09:00:00',
    ultimoLoginEm: '2026-08-17T09:05:00',
  },
  {
    idUsuario: 4,
    nome: 'Administrador Pesquisador',
    email: 'admin.pesquisador@crowdacademico.com.br',
    papeis: ['usuario', 'pesquisador', 'administrador'],
    emailVerificado: true,
    criadoEm: '2026-01-20T11:00:00',
    ultimoLoginEm: '2026-08-17T09:05:00',
    perfilPesquisador: {
      instituicao: 'Instituto Federal de São Paulo',
      areaConhecimento: 'Ciência da Computação',
      tituloAcademico: 'Mestre',
      tipoVinculo: 'institucional',
      statusPesquisador: 'ativo',
      cpfMascarado: '***.123.456-**',
      scoreAtual: 92,
    },
  },
];

export const PAPEIS_FALSOS = [
  { idPapel: 6, nome: 'pesquisador', codigo: 'pesquisador', descricao: 'Pode submeter e gerenciar campanhas de pesquisa.' },
  { idPapel: 7, nome: 'usuario', codigo: 'usuario', descricao: 'Papel padrão de todo cadastro, pode apoiar campanhas.' },
  { idPapel: 8, nome: 'administrador', codigo: 'administrador', descricao: 'Acesso administrativo à área restrita.' },
];

export function buscarUsuarioPorId(idUsuario) {
  return USUARIOS_FALSOS.find((usuario) => usuario.idUsuario === idUsuario) || null;
}

export function papeisDoUsuario(usuario) {
  return PAPEIS_FALSOS.filter((papel) => (usuario.papeis || []).includes(papel.nome));
}
