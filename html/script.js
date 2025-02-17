document.addEventListener('DOMContentLoaded', () => {
    const addExerciseBtn = document.getElementById('addExercise');
    const exerciseList = document.getElementById('exerciseList');

    addExerciseBtn.addEventListener('click', () => {
        createExerciseCounter();
    });

    function createExerciseCounter() {
        const exerciseCounter = document.createElement('div');
        exerciseCounter.className = 'exercise-counter';
        exerciseCounter.draggable = true;

        exerciseCounter.innerHTML = `
            <div class="exercise-header">
                <span class="move-handles">☰</span>
                <button class="delete-btn">Delete</button>
            </div>
            <div class="exercise-inputs">
                <input type="text" placeholder="Exercise Name" class="exercise-name">
                <input type="number" placeholder="Reps" min="1" class="exercise-reps">
                <input type="number" placeholder="Total Sets" min="1" class="exercise-sets">
            </div>
            <div class="set-counter">
                <button class="counter-btn decrease">-</button>
                <span class="current-set">0</span>
                <button class="counter-btn increase">+</button>
                <span class="sets-info">/ <span class="total-sets">0</span> sets</span>
            </div>
        `;

        // Add event listeners for the counter buttons
        const decreaseBtn = exerciseCounter.querySelector('.decrease');
        const increaseBtn = exerciseCounter.querySelector('.increase');
        const currentSetSpan = exerciseCounter.querySelector('.current-set');
        const totalSetsSpan = exerciseCounter.querySelector('.total-sets');
        const setsInput = exerciseCounter.querySelector('.exercise-sets');
        const deleteBtn = exerciseCounter.querySelector('.delete-btn');

        let currentSet = 0;

        decreaseBtn.addEventListener('click', () => {
            if (currentSet > 0) {
                currentSet--;
                currentSetSpan.textContent = currentSet;
            }
        });

        increaseBtn.addEventListener('click', () => {
            const totalSets = parseInt(setsInput.value) || 0;
            if (currentSet < totalSets) {
                currentSet++;
                currentSetSpan.textContent = currentSet;
            }
        });

        setsInput.addEventListener('input', () => {
            totalSetsSpan.textContent = setsInput.value || 0;
            currentSet = 0;
            currentSetSpan.textContent = currentSet;
        });

        deleteBtn.addEventListener('click', () => {
            exerciseCounter.remove();
        });

        // Add drag and drop functionality
        exerciseCounter.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
        });

        exerciseCounter.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

        exerciseList.appendChild(exerciseCounter);
    }

    // Drag and drop functionality for the exercise list
    exerciseList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        const siblings = [...exerciseList.querySelectorAll('.exercise-counter:not(.dragging)')];
        
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            return e.clientY <= box.top + box.height / 2;
        });

        if (nextSibling) {
            exerciseList.insertBefore(draggingElement, nextSibling);
        } else {
            exerciseList.appendChild(draggingElement);
        }
    });
}); 