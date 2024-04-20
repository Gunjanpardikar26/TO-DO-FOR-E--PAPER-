import React, {useEffect, useState} from 'react';
import Create from './Create';
import axios from 'axios';
import { BsFillCheckCircleFill, BsCircleFill, BsFillTrashFill } from 'react-icons/bs';


function Home() {
    const[todos,setTodos] = useState([]);
    const[cnt, setCnt] = useState(0);


    useEffect(() => {
      fetchTasksCount();
      fetchTodos();
  }, []);


  const fetchTasksCount = () => {
  axios.get('https://to-do-for-e-paper-backend.vercel.app/get')
    .then(response => {
      // Assuming the server returns an array of tasks
      setCnt(response.data.length);
    })
    .catch(err => console.log(err));
};

  const fetchTodos = () => {
      fetchTasksCount();
      axios.get('https://to-do-for-e-paper-backend.vercel.app/get')
          .then(result => setTodos(result.data))
          .catch(err => console.log(err));
  };



    const handleEdit = (id, currentDoneState) => {
      const newDoneState = !currentDoneState; // Toggle the current state
      fetchTasksCount();
      axios.put('https://to-do-for-e-paper-backend.vercel.app/update/' + id, { done: newDoneState })
          .then(result => {
              setTodos(prevTodos => prevTodos.map(todo => todo._id === id ? { ...todo, done: newDoneState } : todo));
              fetchTasksCount();
          })
          .catch(err => console.log(err));
  }

    const handleDelete = (id) => {
      axios.delete('https://to-do-for-e-paper-backend.vercel.app/delete/'+id)
      .then(result => {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        fetchTasksCount();
      })
      .catch(err =>console.log(err))
    }
  return (
    <div className='home'>
      <h1>Todo List</h1>
      {/* <h1>{cnt}</h1> */}
      <Create onTaskAdded={fetchTodos} fetchTaskCount = {fetchTasksCount} count = {cnt}/>
      <br />
      {
        todos.length === 0 
        ?(
       <div><h2>No Record</h2></div>)
       :(
        todos.map(todo => (
            <div className='task' key={todo._id}>
              <div className='checkbox' onClick={() => handleEdit(todo._id, todo.done)}>
                {todo.done ? <BsFillCheckCircleFill className='icon'></BsFillCheckCircleFill> 
                : <BsCircleFill className='icon' />
                }
                <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
            </div>

              <div>
                <span><BsFillTrashFill className='icon' onClick = {() => handleDelete(todo._id)}/>
                </span>
              </div>
            </div>
        ))
      )}
    </div>
  )
}

export default Home
