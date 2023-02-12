import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

interface ToDoType {
  done: boolean;
  text: string;
  id: string;
}

const updateById =
  (id: string, updateFunc: (todo: ToDoType) => ToDoType) =>
  (array: ToDoType[]) =>
    array.map((todo) => (todo.id === id ? updateFunc(todo) : todo));

function App() {
  const [value, setValue] = useState<string>('');
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: localValue },
    } = event;
    setValue(localValue);
  };

  const [todos, setTodos] = useState<ToDoType[]>([]);

  const addNewTodo = () => {
    setTodos((oldTodos) => [
      ...oldTodos,
      {
        done: false,
        text: value,
        id: uuidv4(),
      },
    ]);
  };

  const toggleDone = (id: string) => () => {
    setTodos((oldTodos) =>
      updateById(id, (todo) => ({ ...todo, done: !todo.done }))(oldTodos)
    );
  };

  const onSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addNewTodo();
      setValue('');
    }
  };

  return (
    <div className="container">
      <h1>To-Do list</h1>
      <input value={value} onChange={onInputChange} onKeyDown={onSubmit} />
      <div>
        {todos.map((todo) => (
          <div key={todo.id} className="todo">
            <p className={todo.done ? 'done' : ''}>{todo.text}</p>
            <button type="button" onClick={toggleDone(todo.id)}>
              {todo.done ? 'Check as not done' : 'Check as done'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
