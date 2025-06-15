import './App.css';
import React, { useState, useEffect } from 'react';

function MyCustomTodoApp() {
  const [userTasks, setUserTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [inputError, setInputError] = useState('');
  const [sortMethod, setSortMethod] = useState('default');
  const [showStatus, setShowStatus] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem('myTasks');
    if (storedTasks) setUserTasks(JSON.parse(storedTasks));
  }, []);

  // Save tasks to localStorage whenever we change the tasks
  useEffect(() => {
    localStorage.setItem('myTasks', JSON.stringify(userTasks));
  }, [userTasks]);

  // Add a new task after validation
  const handleAddTask = () => {
    const taskToAdd = newTaskText.trim();
    if (!taskToAdd) {
      setInputError('Please enter a task description.');
      return;
    }
    setUserTasks([
      ...userTasks,
      { id: Date.now(), content: taskToAdd, isDone: false }
    ]);
    setNewTaskText('');
    setInputError('');
  };

  // Task completion status
  const toggleTaskCompletion = (id) => {
    setUserTasks(userTasks.map(task =>
      task.id === id ? { ...task, isDone: !task.isDone } : task
    ));
  };

  // Remove a task from the list
  const removeTask = (id) => {
    setUserTasks(userTasks.filter(task => task.id !== id));
  };

  // Start editing a task
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // This function save the edited task
  const saveEdit = (id) => {
    setUserTasks(userTasks.map(task =>
      task.id === id ? { ...task, content: editingText } : task
    ));
    setEditingId(null);
    setEditingText('');
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // This show tasks based on sorting and filtering
  let displayTasks = [...userTasks];
  if (showStatus === 'completed') {
    displayTasks = displayTasks.filter(task => task.isDone);
  } else if (showStatus === 'pending') {
    displayTasks = displayTasks.filter(task => !task.isDone);
  }

  if (sortMethod === 'alphabetical') {
    displayTasks.sort((a, b) => a.content.localeCompare(b.content));
  } else if (sortMethod === 'completion') {
    displayTasks.sort((a, b) => (a.isDone === b.isDone ? 0 : a.isDone ? -1 : 1));
  }

  return (
    <div className="custom-todo-app">
      <h2>My Own To-Do-List</h2>
      <div className="input-section">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => {
            setNewTaskText(e.target.value);
            setInputError('');
          }}
          placeholder="What needs to be done?"
        />
        <button onClick={handleAddTask}>Add Task</button>
        {inputError && <p className="error-message">{inputError}</p>}
      </div>
      <div className="controls">
        <select value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}>
          <option value="default">Default Order</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="completion">Completion Status</option>
        </select>
        <select value={showStatus} onChange={(e) => setShowStatus(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <ul className="task-list">
        {displayTasks.map(task => (
          <li key={task.id} className={task.isDone ? 'done' : ''}>
            {editingId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => saveEdit(task.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleTaskCompletion(task.id)}>
                  {task.content}
                </span>
                <button onClick={() => startEditing(task.id, task.content)}>Edit</button>
                <button onClick={() => removeTask(task.id)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyCustomTodoApp;
