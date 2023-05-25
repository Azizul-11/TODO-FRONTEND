import React from 'react'

const Todoitem = ({title,description,isCompleted,
    updateHandler,
    deleteHandler,
    id

}) => {
  return (
    <div className='todo'>
        <div>   
        <h4>{title}</h4>

         <p>{description}</p>

      </div>
        <div>
            <input onChange={()=>updateHandler(id)} type="checkbox" checked={isCompleted}/>
            <button onClick={deleteHandler} className='btn'>DELETE</button>
        </div>
    </div>
  );
};

export default Todoitem