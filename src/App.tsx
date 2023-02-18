import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorage, LocalKey } from 'ts-localstorage';

type ModeType = 'all' | 'active' | 'completed';

interface ToDoType {
  isDone: boolean;
  text: string;
  id: string;
}

interface ModeObject {
  name: string;
  value: ModeType;
}

const todosKey = new LocalKey<ToDoType[]>('todos', []);

const modes: ModeObject[] = [
  { name: 'All', value: 'all' },
  { name: 'Active', value: 'active' },
  { name: 'Completed', value: 'completed' },
];

function useTodos(): {
  todos: ToDoType[];
  addTodo: (id: string) => void;
  toggleIsDone: (id: string) => void;
  clearTodo: (id: string) => void;
  clearCompleted: () => void;
  isTodos: boolean;
  todosLeft: number;
  clearedTodosLeft: number;
  activeMode: ModeType;
  setActiveMode: (mode: ModeType) => void;
  updateTodo: (id: string, text: string) => void;
} {
  const [todos, setTodos] = useState<ToDoType[]>([]);
  const [activeMode, setActiveMode] = useState<ModeType>('all');

  useEffect(() => {
    const restoredValue = LocalStorage.getItem(todosKey);
    if (restoredValue?.length) {
      setTodos(restoredValue);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    setTodos((oldTodos) => [
      ...oldTodos,
      {
        isDone: false,
        text,
        id: uuidv4(),
      },
    ]);
  };

  const toggleIsDone = (id: string) => {
    setTodos((oldTodos) =>
      oldTodos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  const clearTodo = (id: string) =>
    setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== id));

  const clearCompleted = () =>
    setTodos((oldTodos) => oldTodos.filter((todo) => !todo.isDone));

  const isTodos = Boolean(todos.length);

  const todosLeft: number = useMemo(
    () => todos.filter((el: ToDoType): boolean => !el.isDone).length,
    [todos]
  );

  const clearedTodosLeft: number = useMemo(
    () => todos.filter((el: ToDoType): boolean => el.isDone).length,
    [todos]
  );

  const updateTodo = (id: string, text: string) =>
    setTodos((oldTodos) =>
      oldTodos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );

  const filteredTodos = useMemo(() => {
    switch (activeMode) {
      case 'active':
        return todos.filter((todo) => !todo.isDone);
      case 'completed':
        return todos.filter((todo) => todo.isDone);
      default:
        return todos;
    }
  }, [todos, activeMode]);

  return {
    todos: filteredTodos,
    addTodo,
    toggleIsDone,
    updateTodo,
    clearTodo,
    clearCompleted,
    isTodos,
    todosLeft,
    clearedTodosLeft,
    activeMode,
    setActiveMode,
  } as const;
}

function App() {
  const [value, setValue] = useState<string>('');

  const {
    todos,
    addTodo,
    updateTodo,
    toggleIsDone,
    clearTodo,
    clearCompleted,
    isTodos,
    todosLeft,
    clearedTodosLeft,
    activeMode,
    setActiveMode,
  } = useTodos([]);

  const [editingTodoId, setEditingTodoId] = useState<string | undefined>();
  const [editTodoValue, setEditTodoValue] = useState<string>('');

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodo(value);
      setValue('');
    }
  };

  const editTodo = (id: string, event?: React.MouseEvent<HTMLInputElement>) => {
    const target = event ? (event.target as HTMLInputElement) : undefined;
    if (target) {
      target.setSelectionRange(target.value.length, target.value.length);
    }
    setEditingTodoId(id);
    setEditTodoValue(todos.find((todo) => todo.id === id)?.text ?? '');
  };

  const endEdit = () => {
    if (editingTodoId) {
      updateTodo(editingTodoId, editTodoValue);
    }
    setEditingTodoId(undefined);
  };

  const onSubmitEditingTodo = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      endEdit();
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-5">
      <h1 className=" mb-5 text-2xl font-bold">To-Do list</h1>
      <input
        className="w-full rounded-lg border border-gray-400 bg-white p-3 shadow-md placeholder:italic placeholder:text-slate-400"
        value={value}
        onChange={onInputChange}
        onKeyDown={onSubmit}
        placeholder="Whats needs to be done?"
      />
      <div className="mt-5">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="group mt-5 flex items-center gap-4 rounded-lg bg-white p-5 shadow-md"
          >
            <input
              type="checkbox"
              className="h-6 w-6 shrink-0"
              onChange={() => toggleIsDone(todo.id)}
              checked={todo.isDone}
            />
            <input
              onDoubleClick={(event) => editTodo(todo.id, event)}
              value={editingTodoId === todo.id ? editTodoValue : todo.text}
              onChange={(event) => setEditTodoValue(event.target.value)}
              onKeyDown={onSubmitEditingTodo}
              onBlur={endEdit}
              readOnly={editingTodoId !== todo.id}
              size={1}
              className={`flex-1 border border-gray-500 text-lg font-medium read-only:border-none read-only:focus-within:outline-none ${
                todo.isDone && editingTodoId !== todo.id
                  ? 'text-gray-400 line-through'
                  : ''
              }`}
            />
            <button
              type="button"
              className="shrink-0 pt-1 font-mono text-xl text-gray-200 group-hover:text-gray-500"
              onClick={() => editTodo(todo.id)}
            >
              ✎
            </button>
            <button
              type="button"
              className="active: shrink-0 text-2xl text-red-100  group-hover:text-red-500"
              onClick={() => clearTodo(todo.id)}
            >
              ×
            </button>
          </div>
        ))}
        <div
          className={`flex justify-between ${
            isTodos ? 'visible' : 'hidden'
          } mt-4 text-sm text-gray-400`}
        >
          <p className="">
            {todosLeft} {todosLeft === 1 ? 'item' : 'items'} left
          </p>
          <div className="flex gap-1">
            {modes.map((modeObject) => (
              <button
                key={modeObject.value}
                type="button"
                className={`${
                  modeObject.value === activeMode
                    ? 'rounded border border-gray-400'
                    : ''
                } px-1`}
                onClick={() => setActiveMode(modeObject.value)}
              >
                {modeObject.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`${clearedTodosLeft ? 'block' : 'hidden'}`}
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
