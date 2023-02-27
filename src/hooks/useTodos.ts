import { useEffect, useState } from 'react';
import { LocalStorage, LocalKey } from 'ts-localstorage';
import { v4 as uuidv4 } from 'uuid';

import type { TodoShape } from '../types/todo';

const todosKey = new LocalKey<TodoShape[]>('todos', []);

function useTodos(): {
  todos: TodoShape[];
  addTodo: (text: string) => void;
  toggleIsDone: (id: string) => void;
  clearTodo: (id: string) => void;
  clearCompleted: () => void;
  updateTodo: (id: string, text: string) => void;
} {
  const [todos, setTodos] = useState<TodoShape[]>([]);

  useEffect(() => {
    const restoredValue = LocalStorage.getItem(todosKey);
    if (restoredValue && restoredValue.length > 0) {
      setTodos(restoredValue);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function addTodo(text: string) {
    setTodos((oldTodos) => [
      ...oldTodos,
      {
        isDone: false,
        text,
        id: uuidv4(),
      },
    ]);
  }

  function toggleIsDone(id: string) {
    setTodos((oldTodos) =>
      oldTodos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  }

  function clearTodo(id: string) {
    setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((oldTodos) => oldTodos.filter((todo) => !todo.isDone));
  }

  function updateTodo(id: string, text: string) {
    setTodos((oldTodos) =>
      oldTodos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  }

  return {
    todos,
    addTodo,
    toggleIsDone,
    updateTodo,
    clearTodo,
    clearCompleted,
  } as const;
}

export default useTodos;
