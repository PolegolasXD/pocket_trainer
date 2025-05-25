import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CadastroHTML from './pages/cadastro/cadastro';
import LoginHTML from './pages/login/login';
import HomeHTML from './pages/home/home';
import Dias_de_treinoHTML from './pages/dias_de_treino/dias_de_treino';
import Ficha_pessoalHTML from './pages/ficha_pessoal/ficha_pessoal';
import Treino_de_hojeHTML from './pages/treino_de_hoje/treino_de_hoje';
import ExecucaoHTML from './pages/execucao/execucao';
import CadastroListaHTML from './pages/cadastro_lista/cadastro_lista';
import ChatHTML from './pages/chat_bot/chat';




function RoutesComponents() {
  return (<>
    {/* rotas pelo router ruan, aqui tem o elemento dentro ali e a / pra linkar, da uma olhada na documentaçao do routers dom */}
    <Routes>
      <Route path="/login" element={<LoginHTML />} />
      <Route path="/*" element={<CadastroHTML />} />
      <Route path="/cadastro" element={<CadastroHTML />} />
      <Route path="/home" element={<HomeHTML />} />
      <Route path="/dias_de_treino" element={<Dias_de_treinoHTML />} />
      <Route path="/ficha_pessoal" element={<Ficha_pessoalHTML />} />
      <Route path="/treino_de_hoje" element={<Treino_de_hojeHTML />} />
      <Route path="/execucao" element={<ExecucaoHTML />} />
      <Route path="/cadastro_lista" element={<CadastroListaHTML />} />
      <Route path="/chat" element={<chatHTML />} />
      <Route path="/chat_bot" element={<ChatHTML />} />
    </Routes>
  </>);
}

export default RoutesComponents;
