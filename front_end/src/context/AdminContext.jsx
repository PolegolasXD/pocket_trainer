import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState(() => {
    try {
      const item = window.localStorage.getItem('selectedStudent');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Erro ao ler o aluno selecionado do localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (selectedStudent) {
        window.localStorage.setItem('selectedStudent', JSON.stringify(selectedStudent));
      } else {
        window.localStorage.removeItem('selectedStudent');
      }
    } catch (error) {
      console.error("Erro ao salvar o aluno selecionado no localStorage", error);
    }
  }, [selectedStudent]);

  const selectStudent = (student) => {
    setSelectedStudent(student);
  };

  const clearSelectedStudent = () => {
    setSelectedStudent(null);
  };

  const value = {
    selectedStudent,
    selectStudent,
    clearSelectedStudent,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}; 
