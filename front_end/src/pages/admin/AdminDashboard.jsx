import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import { useAdmin } from '../../context/AdminContext';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectStudent } = useAdmin();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/users/students', config);
        setStudents(res.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toString().includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <header className={styles.header}>
          <h1>Admin Dashboard</h1>
          <p>Select a student to view their data or manage their workout plan.</p>
        </header>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.studentList}>
          {filteredStudents.map(student => (
            <div key={student.id} className={styles.studentCard} onClick={() => selectStudent(student)}>
              <h3>{student.name}</h3>
              <p>ID: {student.id}</p>
              <p>Email: {student.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
