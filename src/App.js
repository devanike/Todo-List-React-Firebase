import { useState, useEffect } from "react"
import { db } from './firebase';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";  // Firebase Firestore instance
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

// const db = getFirestore();
const isProduction = process.env.NODE_ENV === 'production';

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  // const [tasks, setTasks] = useState([ 
  //   {
  //     id: 1,
  //     text: 'Doctors Appointment',
  //     day: 'Feb 5th at 2:30pm',
  //     reminder: true,
  //   },
  //   {
  //     id: 2,
  //     text: 'Meeting at School',
  //     day: 'Feb 6th at 1:30pm',
  //     reminder: true,
  //   },
  //   {
  //     id: 3,
  //     text: 'Food Shopping',
  //     day: 'Feb 5th at 2:30pm',
  //     reminder: false,
  //   }
  // ])

  // using firebase

  // Fetch tasks from Firestore when the component mounts
  useEffect(() => {
    // Fetch tasks on component mount
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const tasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasks);  // Set tasks to state
      } catch (e) {
        console.error("Error fetching tasks: ", e);
      }
    };

    fetchTasks();
  }, []);

  // add task
  const addTask = async (task) => {
    try {
      // Reference the collection where tasks are stored
      const tasksCollection = collection(db, "tasks"); 
  
      // Add new task to Firestore collection
      const docRef = await addDoc(tasksCollection, task);

      // Create the new task object using the doc ID from Firestore
      const newTask = { id: docRef.id, ...task };
  
      setTasks([...tasks, newTask])
      console.log("Task added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding task: ", e);
    }
  };

  // delete task
  const deleteTask = async (id) => {
    try {
      // Reference the document you want to delete
      const taskDoc = doc(db, "tasks", id); // Specify collection and document ID
  
      // Delete the task from Firestore
      await deleteDoc(taskDoc);
  
      // Update the state to remove the deleted task from the UI
      setTasks(tasks.filter((task) => task.id !== id));
  
      console.log("Task deleted with ID: ", id);
    } catch (e) {
      console.error("Error deleting task: ", e);
    }
  };
  
  // toggling reminder
  const toggleReminder = async (id) => {
    try {
      // Reference the task document
      const taskDoc = doc(db, "tasks", id); // Reference to the document in Firestore
  
      // Get the task to toggle the reminder
      const updatedTask = tasks.find((task) => task.id === id);
      const updatedReminder = !updatedTask.reminder; // Toggle the reminder
  
      // Update the reminder field in Firestore
      await updateDoc(taskDoc, {
        reminder: updatedReminder,
      });
  
      // Update the local state to reflect the change in the UI
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, reminder: updatedReminder } : task
        )
      );
  
      console.log(`Reminder updated for task ${id}`);
    } catch (e) {
      console.error("Error toggling reminder: ", e);
    }
  };
  
  
  // end of firebase usage

  // useEffect(() => {
  //   const getTasks = async () => {
  //     const tasksFromServer = await fetchTasks()
  //     setTasks(tasksFromServer)
  //   }

  //   getTasks()
  // }, [])

  // fetch tasks
  // const fetchTasks = async () => {
  //   const res = await fetch('http://localhost:5000/tasks')
  //   const data = await res.json()

  //   return data
  // }

  // add task for mock server
  // const addTask = async (task) => {
  //   const res = await fetch('http://localhost:5000/tasks', {
  //     method: 'POST',  //POST means 'create new'
  //     headers: {
  //       'Content-type': 'application/json',
  //     },
  //     body: JSON.stringify(task),  // converts task to json format
  //   })

  //   const data = await res.json()
  //   setTasks([...tasks, data])
  // }


  // Add task
  // const addTask = (task) => {
  //   const id = Math.floor(Math.random() * 10000) + 1

  //   const newTask = { id, ...task}  // a new object with the id and whatever's in task, which is text, day and reminder
  //   setTasks([...tasks, newTask])  //copies the current task already there and adds the new task
  // }

  // Delete task
  // const deleteTask = (id) => {
  //   // updates the task list to not contain the task with the selected id
  //   setTasks(tasks.filter((task) => task.id !== id))  
  // }

  // delete tasks for mock server
  // const deleteTask = async (id) => {
  //   await fetch(`http://localhost:5000/tasks/${id}`, {
  //     method: 'DELETE'
  //   })

  //   setTasks(tasks.filter((task) => task.id !== id))
  // }

    // fetch task for toggle reminder
    // const fetchTask = async (id) => {
    //   const res = await fetch(`http://localhost:5000/tasks/${id}`)
    //   const data = await res.json()
  
    //   return data
    // }

    // toggle reminder for mock server
    // const toggleReminder = async (id) => {
    //   const taskToToggle = await fetchTask(id)
    //   const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}   //creates updated version of the task with flipped reminder

    //   const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    //     method: 'PUT',  //put means update
    //     headers: {
    //       'Content-type': 'application/json',
    //     },
    //     body: JSON.stringify(updTask),
    //   })

    //   const data =  await res.json()  //gets the updated task back

    //   // updates the react state
    //   setTasks(
    //     tasks.map((task) => 
    //       task.id === id ? {...task, reminder: data.reminder} : task
    //     ))
    //     // ...task - keeps the existing properties of the task
      
      
    // }

  // Toggle Reminder
  // const toggleReminder = (id) =>  {
  //   setTasks(
  //     tasks.map((task) => 
  //       task.id === id ? {...task, reminder: !task.reminder} : task))
  //   // ...task - keeps the existing properties of the task
  // }

  return (
    <Router basename={isProduction ? '/Todo-List-React-Firebase' : ''}>
      <div className="container">
        <Header onAdd={() => setShowAddTask (!showAddTask)} showAdd={showAddTask} />
        
        <Routes>
          <Route path="/" element={
            <>
              {showAddTask && <AddTask onAdd={addTask}/>}   {/*if showaddtask is true, show add task*/}
              {tasks.length > 0 ? (
                <Tasks 
                  tasks={ tasks } 
                  onDelete={ deleteTask } 
                  onToggle={ toggleReminder }
                />
              ) : (
                'No Tasks To Show'
              )}
            </>
            } 
          />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


//async - this function will take some time
//await - wait for this to finish before continuing

//TODO: add a checkbox, before each task, that strikes out a task when clicked

// npm run start
// npm run server