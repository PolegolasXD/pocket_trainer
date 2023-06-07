import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CadastroHTML from './pages/cadastro/cadastro';
import LoginHTML from './pages/login/login';

function RoutesComponents() {
  return (<>
    <Routes>
      <Route path="/login" element={<LoginHTML />} />
      <Route path="" element={<CadastroHTML />} />
      <Route path="/cadastro" element={<CadastroHTML />} />
      {/* <Route path="/dias_de_treino" element={<Dias_de_treinoHTML />} /> */}
      {/* <Route path="/ficha_pessoal" element={<Ficha_pessoalHTML />} /> */}
      {/* <Route path="/home" element={<HomeHTML />} /> */}
      {/* <Route path="/treino_de_hoje" element={<Treino_de_hojeHTML />} /> */}
    </Routes>
  </>);
}

export default RoutesComponents;
