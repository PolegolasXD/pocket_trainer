import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

function FichaPessoal() {
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: '',
    email: '',
    genero: '',
    data_nascimento: '',
    peso: '',
    altura: '',
    objetivo_principal: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('usuario'));

        if (!token || !user) {
          setError('Usuário não autenticado.');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, config);

        // Mapeia os dados do backend (inglês/db) para o estado (português)
        const userData = res.data;
        setDadosUsuario({
          nome: userData.name,
          email: userData.email,
          genero: userData.sexo,
          data_nascimento: userData.data_nascimento,
          peso: userData.peso,
          altura: userData.altura,
          objetivo_principal: userData.objetivo,
        });

      } catch (err) {
        console.error('Falha ao buscar dados do usuário:', err);
        setError('Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosUsuario(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapeia os dados para o formato exato do banco de dados
    const dadosParaEnviar = {
      name: dadosUsuario.nome,
      email: dadosUsuario.email,
      sexo: dadosUsuario.genero,
      peso: dadosUsuario.peso ? parseFloat(dadosUsuario.peso) : null,
      altura: dadosUsuario.altura ? parseFloat(dadosUsuario.altura) : null,
      objetivo: dadosUsuario.objetivo_principal,
      data_nascimento: dadosUsuario.data_nascimento,
    };

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('usuario'));
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, dadosParaEnviar, config);
      alert('Dados atualizados com sucesso!');
    } catch (err) {
      console.error('Falha ao atualizar dados:', err);
      alert('Falha ao atualizar os dados.');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Ficha Pessoal</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Nome</label>
              <input type="text" name="nome" value={dadosUsuario.nome || ''} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" value={dadosUsuario.email || ''} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Gênero</label>
              <select name="genero" value={dadosUsuario.genero || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Data de Nascimento</label>
              <input type="date" name="data_nascimento" value={dadosUsuario.data_nascimento ? dadosUsuario.data_nascimento.split('T')[0] : ''} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Peso (kg)</label>
              <input type="number" name="peso" value={dadosUsuario.peso || ''} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Altura (cm)</label>
              <input type="number" name="altura" value={dadosUsuario.altura || ''} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Objetivo Principal</label>
            <select name="objetivo_principal" value={dadosUsuario.objetivo_principal || ''} onChange={handleChange}>
              <option value="">Selecione um objetivo</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="emagrecimento">Emagrecimento</option>
              <option value="resistencia">Resistência</option>
              <option value="qualidade_de_vida">Qualidade de Vida</option>
            </select>
          </div>
          <button type="submit" className={styles.submitButton}>Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
}

export default FichaPessoal;
