import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  PanResponder,
  Animated,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  const [exercises, setExercises] = useState([]);
  const [pans, setPans] = useState([]);

  useEffect(() => {
    setPans(exercises.map(() => new Animated.ValueXY()));
  }, [exercises.length]);

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

  const moveExercise = (from, to) => {
    const newExercises = [...exercises];
    const [removed] = newExercises.splice(from, 1);
    newExercises.splice(to, 0, removed);
    setExercises(newExercises);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Simple Workout Counter</Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={createExerciseCounter}
      >
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>

      <ScrollView style={styles.exerciseList}>
        {exercises.map((exercise, index) => (
          <Animated.View
            key={exercise.id}
            style={[styles.exerciseCounter, {
              transform: pans[index] ? pans[index].getTranslateTransform() : [],
            }]}
            {...PanResponder.create({
              onStartShouldSetPanResponder: () => true,
              onPanResponderMove: (_, gesture) => {
                if (!pans[index]) return;
                Animated.event([null, { dy: pans[index].y }], {
                  useNativeDriver: false,
                })(_, gesture);
                const newIndex = Math.floor((gesture.moveY - 100) / 150);
                if (newIndex !== index && newIndex >= 0 && newIndex < exercises.length) {
                  moveExercise(index, newIndex);
                }
              },
              onPanResponderRelease: () => {
                if (!pans[index]) return;
                Animated.spring(pans[index], {
                  toValue: { x: 0, y: 0 },
                  useNativeDriver: false,
                }).start();
              },
            }).panHandlers}
          >
            <View style={styles.exerciseHeader}>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteExercise(exercise.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.exerciseInputs}>
              <TextInput
                style={styles.input}
                placeholder="Exercise Name"
                value={exercise.name}
                onChangeText={(value) => handleInputChange(exercise.id, 'name', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Reps"
                keyboardType="numeric"
                value={exercise.reps}
                onChangeText={(value) => handleInputChange(exercise.id, 'reps', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Total Sets"
                keyboardType="numeric"
                value={String(exercise.totalSets)}
                onChangeText={(value) => handleInputChange(exercise.id, 'totalSets', parseInt(value) || 0)}
              />
            </View>

            <View style={styles.setCounter}>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => handleSetCounter(exercise.id, false)}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.currentSet}>{exercise.currentSet}</Text>

              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => handleSetCounter(exercise.id, true)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>

              <Text style={styles.setsInfo}>/ {exercise.totalSets} sets</Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseCounter: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  exerciseInputs: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  setCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  counterButton: {
    backgroundColor: '#008CBA',
    width: 45,
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  currentSet: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'center',
  },
  setsInfo: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 3,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default function Main() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <App />
    </SafeAreaProvider>
  );
} 