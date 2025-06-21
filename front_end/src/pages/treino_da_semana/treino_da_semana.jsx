import React, { useState } from 'react';
import styles from './styles.module.css';

const WeeklyWorkout = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  const weeklyWorkout = {
    monday: [{ exercise: 'Bench Press', series: 4, reps: 10 }],
    tuesday: [{ exercise: 'Squat', series: 5, reps: 8 }],
    wednesday: [{ exercise: 'Rest', series: 0, reps: 0 }],
    thursday: [{ exercise: 'Bent Over Row', series: 4, reps: 10 }],
    friday: [{ exercise: 'Overhead Press', series: 4, reps: 10 }],
    saturday: [{ exercise: 'Rest', series: 0, reps: 0 }],
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const handleDayClick = (day) => {
    setSelectedDay({
      day,
      exercises: weeklyWorkout[day],
    });
  };

  const closeModal = () => {
    setSelectedDay(null);
  };

  return (
    <div className={styles.container}>
      <h1>Treino da Semana</h1>
      <div className={styles.grid}>
        {daysOfWeek.map(day => (
          <div key={day} className={styles.dayColumn} onClick={() => handleDayClick(day)}>
            <h2>{day.charAt(0).toUpperCase() + day.slice(1)}</h2>
            <div className={styles.exerciseList}>
              {weeklyWorkout[day].map((ex, index) => (
                <div key={index} className={styles.exerciseCard}>
                  {ex.exercise === 'Rest' ? (
                    <p className={styles.restDay}>Rest</p>
                  ) : (
                    <>
                      <h3>{ex.exercise}</h3>
                      <p>{ex.series} sets x {ex.reps} reps</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>{selectedDay.day.charAt(0).toUpperCase() + selectedDay.day.slice(1)}'s Workout</h2>
            {selectedDay.exercises[0].exercise === 'Rest' ? (
              <p className={styles.restDay}>Rest day.</p>
            ) : (
              <ul>
                {selectedDay.exercises.map((ex, index) => (
                  <li key={index}>
                    <strong>{ex.exercise}</strong>: {ex.series} sets x {ex.reps} reps
                  </li>
                ))}
              </ul>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyWorkout; 
