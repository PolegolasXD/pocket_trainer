import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './personal_sheet.module.css';

function PersonalSheet() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    data_nascimento: '',
    peso: '',
    altura: '',
    objetivo: '',
    sexo: ''
  });
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!token || !user) {
          setNotification({ message: 'User not found.', type: 'error' });
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`http://localhost:5000/api/users/${user.id}`, config);
        const userData = res.data;
        setUserData({
          ...userData,
          data_nascimento: userData.data_nascimento ? new Date(userData.data_nascimento).toISOString().split('T')[0] : ''
        });
      } catch (error) {
        console.error('Error fetching user data', error);
        setNotification({ message: 'Error fetching data.', type: 'error' });
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`http://localhost:5000/api/users/${userData.id}`, userData, config);
      const user = res.data;
      setUserData({
        ...user,
        data_nascimento: user.data_nascimento ? new Date(user.data_nascimento).toISOString().split('T')[0] : ''
      });
      setNotification({ message: 'Data updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating data', error);
      setNotification({ message: 'Error updating data.', type: 'error' });
    }
  };

  return (
    <div>
      {/* Conteúdo da Ficha Pessoal aqui */}
    </div>
  );
}

export default PersonalSheet; 
