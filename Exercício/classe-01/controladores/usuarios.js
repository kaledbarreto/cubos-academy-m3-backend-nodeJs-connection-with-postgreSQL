const conexao = require('../conexao');

const listarUsuarios = async (req, res) => {
  try {
    const query = 'SELECT * FROM usuarios';
    const { rows: usuarios } = await conexao.query(query);
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const obterUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [id]);

    if (usuario.rowCount === 0) {
      return res.status(404).json('Usuário não encontrado.');
    }

    return res.status(200).json(usuario.rows[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const cadastrarUsuario = async (req, res) => {
  const { nome, idade, email, telefone, cpf } = req.body;
  try {
    const query = 'INSERT INTO usuarios (nome, idade, email, telefone, cpf) VALUES ($1, $2, $3, $4, $5)';
    const usuario = await conexao.query(query, [nome, idade, email, telefone, cpf]);

    if (usuario.rowCount === 0) {
      return res.status(400).json('Não foi possível cadastrar o usuário.');
    }

    return res.status(200).json('Usuário cadastrado com sucesso.');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, idade, email, telefone, cpf } = req.body;

  try {
    const usuario = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [id]);

    if (usuario.rowCount === 0) {
      return res.status(404).json('Usuário não encontrado');
    }

    const query = `UPDATE usuarios SET
    nome = $1, 
    idade = $2, 
    email = $3, 
    telefone = $4,
    cpf = $5
    WHERE id = $6
    `

    const usuarioAtualizado = await conexao.query(query, [nome, idade, email, telefone, cpf, id]);

    if (usuarioAtualizado.rowCount === 0) {
      return res.status(400).json('Não foi possível atualizar o usuário.');
    }

    return res.status(200).json('O usuário foi atualizado com sucesso.');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const excluirUsuario = async function (req, res) {
  const { id } = req.params;

  try {
    const usuario = await conexao.query('SELECT * FROM usuarios WHERE id = $1', [id]);

    if (usuario.rowCount === 0) {
      return res.status(404).json('Usuário não encontrado.');
    }

    const query = `SELECT * FROM usuarios
    JOIN emprestimos ON usuarios.id = emprestimos.usuario_id
    WHERE usuarios.id = $1`;
    const usuarioDelete = await conexao.query(query, [id]);

    if (usuarioDelete.rowCount === 0) {
      await conexao.query('DELETE FROM usuarios WHERE id = $1', [id]);

      return res.status(200).json('O usuário foi excluido com sucesso');
    }

    return res.status(400).json('Não foi possível excluir o usuário pois ele tem um empréstimo atrelado.');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  listarUsuarios,
  obterUsuario,
  cadastrarUsuario,
  atualizarUsuario,
  excluirUsuario
}