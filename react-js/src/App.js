import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  console.log('React is running!');
  const [exercises, setExercises] = useState([]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const createExerciseCounter = () => {
    const newExercise = {
      id: Date.now(),
      name: '',
      reps: '',
      totalSets: 0,
      currentSet: 0,
    };
    setExercises([...exercises, newExercise]);
  };

  const handleInputChange = (id, field, value) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === id) {
        const updatedExercise = { ...exercise, [field]: value };
        if (field === 'totalSets') {
          updatedExercise.currentSet = 0;
        }
        return updatedExercise;
      }
      return exercise;
    }));
  };

  const handleSetCounter = (id, increment) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === id) {
        const newCount = exercise.currentSet + (increment ? 1 : -1);
        if (newCount >= 0 && newCount <= exercise.totalSets) {
          return { ...exercise, currentSet: newCount };
        }
      }
      return exercise;
    }));
  };

  const deleteExercise = (id) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newExercises = [...exercises];
      const draggedItem = newExercises[dragItem.current];
      newExercises.splice(dragItem.current, 1);
      newExercises.splice(dragOverItem.current, 0, draggedItem);
      setExercises(newExercises);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="container">
      <h1>Simple Workout Counter</h1>
      <button className="add-btn" onClick={createExerciseCounter}>
        Add Exercise
      </button>
      <div className="exercise-list">
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="exercise-counter"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="exercise-header">
              <span className="move-handles">☰</span>
              <button 
                className="delete-btn"
                onClick={() => deleteExercise(exercise.id)}
              >
                Delete
              </button>
            </div>
            <div className="exercise-inputs">
              <input
                type="text"
                placeholder="Exercise Name"
                value={exercise.name}
                onChange={(e) => handleInputChange(exercise.id, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Reps"
                min="1"
                value={exercise.reps}
                onChange={(e) => handleInputChange(exercise.id, 'reps', e.target.value)}
              />
              <input
                type="number"
                placeholder="Total Sets"
                min="1"
                value={exercise.totalSets}
                onChange={(e) => handleInputChange(exercise.id, 'totalSets', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="set-counter">
              <button 
                className="counter-btn decrease"
                onClick={() => handleSetCounter(exercise.id, false)}
              >
                -
              </button>
              <span className="current-set">{exercise.currentSet}</span>
              <button 
                className="counter-btn increase"
                onClick={() => handleSetCounter(exercise.id, true)}
              >
                +
              </button>
              <span className="sets-info">/ <span className="total-sets">{exercise.totalSets}</span> sets</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 