import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CadastroHTML from './pages/cadastro/cadastro';
import LoginHTML from './pages/login/login';
import HomeHTML from './pages/home/home';
import Dias_de_treinoHTML from './pages/dias_de_treino/dias_de_treino';
import Ficha_pessoalHTML from './pages/ficha_pessoal/ficha_pessoal';
import Treino_de_hojeHTML from './pages/treino_de_hoje/treino_de_hoje';
import ExecucaoHTML from './pages/execucao/execucao';
import ChatHTML from './pages/chat_bot/chat';
import DashboardHTML from './pages/dashboard/Dashboard';
import Historico from './pages/historico/historico';
import TreinoForm from './pages/treino_form/treino_form';

function RoutesComponents() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginHTML />} />
        <Route path="/*" element={<CadastroHTML />} />
        <Route path="/cadastro" element={<CadastroHTML />} />
        <Route path="/home" element={<HomeHTML />} />
        <Route path="/dias_de_treino" element={<Dias_de_treinoHTML />} />
        <Route path="/ficha_pessoal" element={<Ficha_pessoalHTML />} />
        <Route path="/treino_de_hoje" element={<Treino_de_hojeHTML />} />
        <Route path="/execucao" element={<ExecucaoHTML />} />
        <Route path="/chat" element={<ChatHTML />} />
        <Route path="/chat_bot" element={<ChatHTML />} />
        <Route path="/dashboard" element={<DashboardHTML />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/registrar_treino" element={<TreinoForm />} />
      </Routes>
    </>
  );
}

export default RoutesComponents;
