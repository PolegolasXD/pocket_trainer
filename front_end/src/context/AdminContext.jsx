import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

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
