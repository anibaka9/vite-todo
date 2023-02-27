import { useMemo, useState } from 'react';

import type { Mode, TodoShape } from '../types/todo';

function useMode(todos: readonly TodoShape[]) {
  const [activeMode, setActiveMode] = useState<Mode>('all');

  const filteredTodos = useMemo(() => {
    if (activeMode === 'active') {
      return todos.filter((todo) => !todo.isDone);
    }
    if (activeMode === 'completed') {
      return todos.filter((todo) => todo.isDone);
    }
    return todos;
  }, [todos, activeMode]);

  return { filteredTodos, activeMode, setActiveMode };
}

export default useMode;
