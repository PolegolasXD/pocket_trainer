import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Cadastro from './pages/cadastro/cadastro';
import Login from './pages/login/login';
import Home from './pages/home/home';
import DiasDeTreino from './pages/dias_de_treino/dias_de_treino';
import FichaPessoal from './pages/ficha_pessoal/ficha_pessoal';
import TreinoDaSemana from './pages/treino_da_semana/treino_da_semana';
import Chat from './pages/chat_bot/chat';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Historico from './pages/historico/historico';
import TreinoForm from './pages/treino_form/treino_form';
import Layout from './components/Layout/Layout';

function RoutesComponents() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/dias-de-treino" element={<DiasDeTreino />} />
        <Route path="/ficha-pessoal" element={<FichaPessoal />} />
        <Route path="/treino-da-semana" element={<TreinoDaSemana />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/registrar_treino" element={<TreinoForm />} />
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default RoutesComponents;
