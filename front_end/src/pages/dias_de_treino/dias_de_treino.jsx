import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import styles from './styles.module.css';
import Sidebar from '../../components/sidebar/sidebar';

function Dias_de_treinoHTML() {
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    console.log(date);
  };

  return (
    <div className={styles.container}>
      <Sidebar /> {/* Sidebar global aqui */}

      <div className={styles.descriptionContainer}>
        {/* Descrição opcional */}
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.calendarContainer}>
          <Calendar
            onChange={handleDateChange}
            className={`${styles.customCalendar} custom-calendar`}
            dayClassName={(date) =>
              date.toDateString() === new Date().toDateString() ? "today" : ""
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Dias_de_treinoHTML;
