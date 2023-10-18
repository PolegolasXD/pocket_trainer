import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import iconCadastro from '../../assets/icons/IconesCadastro.png';
import iconUser from '../../assets/icons/IconesUsuario.png';

function CadastroListaHTML() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleNomeChange = (event) => {
    setNome(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCadastro = () => {
    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      alert('E-mail já cadastrado');
      return;
    }

    const newUser = { nome, email, password };
    setUsers([...users, newUser]);
    alert('Usuário cadastrado com sucesso');
    console.log("teste save branch")
    setNome('');
    setEmail('');
    setPassword('');
  };
  
  const handleUpdate = () => {
    const updatedUsers = [...users];
    updatedUsers[selectedUser.index] = { nome, email, password };
    setUsers(updatedUsers);
    alert('Usuário atualizado com sucesso');
    setSelectedUser(null);
    setNome('');
    setEmail('');
    setPassword('');
  };

  const handleDelete = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
    alert('Usuário excluído com sucesso');
  };

  const handleEdit = (index) => {
    const selectedUser = users[index];
    setSelectedUser({ index, ...selectedUser });
    setNome(selectedUser.nome);
    setEmail(selectedUser.email);
    setPassword(selectedUser.password);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.crudContainer}>
        <h2 className={styles.crudTitle}>Adicionar Usuário</h2>
        <div className={styles.crudInputsContainer}>
          <div className={styles.crudInputContainer}>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={handleNomeChange}
              className={styles.crudInput}
            />
          </div>
          <div className={styles.crudInputContainer}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className={styles.crudInput}
            />
          </div>
          <div className={styles.crudInputContainer}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
              className={styles.crudInput}
            />
          </div>
          {selectedUser ? (
            <button onClick={handleUpdate} className={styles.crudUpdateButton}>
              Atualizar
            </button>
          ) : (
            <button onClick={handleCadastro} className={styles.crudAddButton}>
              Adicionar
            </button>
          )}
        </div>
      </div>

      {/* Lista de usuários */}
      <ul className={styles.crudList}>
        {users.map((user, index) => (
          <li key={index} className={styles.crudListItem}>
            <span>Nome: {user.nome}</span>
            <span>Email: {user.email}</span>
            <span>Senha: {user.password}</span>
            <div>
              <button onClick={() => handleEdit(index)} className={styles.crudEditButton}>
                Editar
              </button>
              <button onClick={() => handleDelete(index)} className={styles.crudDeleteButton}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.crudBottomSection}>
        <Link to="/login" className={styles.crudLink}>
          Ir para a página de Login
        </Link>
      </div>
    </div>
  );
}

export default CadastroListaHTML;
