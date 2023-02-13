import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
    <div className="mx-auto max-w-2xl p-5">
      <h1 className="mb-5 text-2xl font-bold">To-Do list</h1>
      <input
        className="w-full rounded-lg border border-gray-400 bg-white p-3 shadow-md"
        value={value}
        onChange={onInputChange}
        onKeyDown={onSubmit}
      />
      <div className="mt-5">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="mt-5 flex items-center justify-between rounded-lg bg-white p-5 shadow-md"
          >
            <p
              className={`text-lg font-medium ${
                todo.done ? 'text-gray-500 line-through' : ''
              }`}
            >
              {todo.text}
            </p>
            <button
              type="button"
              className="rounded-lg bg-indigo-500 p-3 text-white shadow-md hover:bg-indigo-600"
              onClick={toggleDone(todo.id)}
            >
              {todo.done ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
