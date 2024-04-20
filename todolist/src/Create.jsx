import React, { useState, useEffect } from 'react'
import axios from 'axios'
function Create({onTaskAdded,fetchTaskCount, count}) {
    const[task,setTask] = useState('');

    useEffect(() => {
      fetchTaskCount();
    }, []);


    const handleAdd = () => {
      fetchTaskCount();
      if (count >= 5) {
        axios.get('https://to-do-for-e-paper-backend.vercel.app/tasks/first')
          .then(response => {
            const firstTask = response.data;
            if (firstTask && firstTask.done) {

              axios.put(`https://to-do-for-e-paper-backend.vercel.app/replace/${firstTask._id}`, { task: task })

              // axios.put('https://to-do-for-e-paper.vercel.app/replace/${firstTask.    _id}', { task: task })

                .then(() => {
                  setTask('');
                  console.log('Task replaced successfully.');
                  fetchTaskCount();
                  if (onTaskAdded) {
                    onTaskAdded();
                }
                })
                .catch(err => console.log("error while replacing"+err));
            } else {
              alert('Please complete a task before adding a new one.');
            }
          })
          .catch(err => console.log("error while running first api"+err));
      } else {
        axios.post('https://to-do-for-e-paper-backend.vercel.app/add', { task: task })
          .then(() => {
            setTask('');
            fetchTaskCount();
            if (onTaskAdded) {
              onTaskAdded();
          }
          })
          .catch(err => console.log(err));
      }
    };


  return (
    <div className='create-form'>
      {/* <h1>{cnt}</h1> */}
      <input type="text" name="" id="" placeholder='Enter Task' value={task} onChange={(e) => setTask(e.target.value)}/>
      <button type="button" onClick={handleAdd}>Add</button>
    </div>
  )
}

export default Create
