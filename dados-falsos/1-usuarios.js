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
      scoreAtual: 87,
    },
  },
];

export const PAPEIS_FALSOS = [
  { idPapel: 6, nome: 'pesquisador', codigo: 'pesquisador', descricao: 'Pode submeter e gerenciar campanhas de pesquisa.' },
  { idPapel: 7, nome: 'usuario', codigo: 'usuario', descricao: 'Papel padrão de todo cadastro, pode apoiar campanhas.' },
];

export function buscarUsuarioPorId(idUsuario) {
  return USUARIOS_FALSOS.find((usuario) => usuario.idUsuario === idUsuario) || null;
}

export function papeisDoUsuario(usuario) {
  return PAPEIS_FALSOS.filter((papel) => (usuario.papeis || []).includes(papel.nome));
}
