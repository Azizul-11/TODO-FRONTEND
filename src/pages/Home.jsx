import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context, server } from '../main';
import { toast } from 'react-hot-toast';
import Todoitem from './../component/Todoitem';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { isAuthenticated,} = useContext(Context);

  const updateHandler = async (id) => {
    try {
      await axios.put(`${server}/task/${id}`, {}, { withCredentials: true });
      toast.success('Task updated successfully');
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${server}/task/${id}`, { withCredentials: true });
      toast.success('Task deleted successfully');
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${server}/task/new`,
        {
          title,
          description,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setTitle('');
      setDescription('');
      toast.success('Task added successfully');
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${server}/task/my`, {
        withCredentials: true,
      })
      .then((res) => {
        setTasks(res.data.task);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, [refresh]);
  if(!isAuthenticated) return <Navigate to={"/login"}/>
  return (
    <div className='container'>
      <div className='login'>
        <section>
          <form onSubmit={submitHandler}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type='text'
              placeholder='Title'
              required
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type='text'
              placeholder='Description'
              required
            />
            <button disabled={loading} type='submit'>
              Add Task
            </button>
          </form>
        </section>
      </div>
      <section className='todosContainer'>
        {tasks.map((task) => (
          <Todoitem
            key={task._id}
            title={task.title}
            description={task.description}
            isCompleted={task.isCompleted}
            updateHandler={() => updateHandler(task._id)}
            deleteHandler={() => deleteHandler(task._id)}
          />
        ))}
      </section>
    </div>
  );
};

export default Home;
