import { useCallback, useMemo } from 'react';

import type { TodoShape, Mode } from './types/todo';

interface ModeObject {
  name: string;
  value: Mode;
}

interface ControlsProps {
  readonly todos: readonly TodoShape[];
  readonly activeMode: Mode;
  readonly setActiveMode: (mode: Mode) => void;
  readonly clearCompleted: () => void;
}

const modes: ModeObject[] = [
  { name: 'All', value: 'all' },
  { name: 'Active', value: 'active' },
  { name: 'Completed', value: 'completed' },
];

function Controls({
  todos,
  activeMode,
  setActiveMode,
  clearCompleted,
}: ControlsProps) {
  const isTodos = todos.length > 0;

  const todosLeft: number = useMemo(
    () => todos.filter((element): boolean => !element.isDone).length,
    [todos]
  );

  const clearedTodosLeft: number = useMemo(
    () => todos.filter((element): boolean => element.isDone).length,
    [todos]
  );

  const onSetModeClick = useCallback(
    (value: Mode) => () => {
      setActiveMode(value);
    },
    [setActiveMode]
  );

  return (
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
            className={`${
              modeObject.value === activeMode
                ? 'rounded border border-gray-400'
                : ''
            } px-1`}
            key={modeObject.value}
            onClick={onSetModeClick(modeObject.value)}
            type="button"
          >
            {modeObject.name}
          </button>
        ))}
      </div>
      <button
        className={String(clearedTodosLeft ? 'block' : 'hidden')}
        onClick={clearCompleted}
        type="button"
      >
        Clear completed
      </button>
    </div>
  );
}

export default Controls;
