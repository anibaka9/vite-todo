import { useCallback, useState } from 'react';

import type { TodoShape } from './types/todo';

interface TodoProps {
  readonly todo: TodoShape;
  readonly toggleIsDone: (id: string) => void;
  readonly updateTodo: (id: string, text: string) => void;
  readonly clearTodo: (id: string) => void;
}

function Todo({
  todo,
  toggleIsDone,
  updateTodo,
  clearTodo,
}: TodoProps): JSX.Element {
  const [editValue, setEditValue] = useState<string>(todo.text);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const editTodo = useCallback(
    (event?: React.MouseEvent<HTMLInputElement>) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const target = event ? (event.target as HTMLInputElement) : undefined;
      if (target) {
        target.setSelectionRange(target.value.length, target.value.length);
      }
      setIsEdit(true);
      setEditValue(todo.text);
    },
    [todo.text]
  );

  const endEdit = useCallback(() => {
    if (isEdit) {
      updateTodo(todo.id, editValue);

      setIsEdit(false);
    }
  }, [editValue, isEdit, todo.id, updateTodo]);

  const onSubmitEditingTodo = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        endEdit();
      }
    },
    [endEdit]
  );

  const onCheckboxChange = useCallback(
    (id: string) => () => {
      toggleIsDone(id);
    },
    [toggleIsDone]
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(event.target.value);
    },
    []
  );

  const onClearTodoClick = useCallback(
    (id: string) => () => {
      clearTodo(id);
    },
    [clearTodo]
  );

  const onEditButtonClick = useCallback(() => {
    editTodo();
  }, [editTodo]);

  return (
    <div className="group mt-5 flex items-center gap-4 rounded-lg bg-white p-5 shadow-md">
      <input
        checked={todo.isDone}
        className="h-6 w-6 shrink-0"
        onChange={onCheckboxChange(todo.id)}
        type="checkbox"
      />

      <input
        className={`flex-1 border border-gray-500 text-lg font-medium read-only:border-none read-only:focus-within:outline-none ${
          todo.isDone && !isEdit ? 'text-gray-400 line-through' : ''
        }`}
        onBlur={endEdit}
        onChange={onInputChange}
        onDoubleClick={editTodo}
        onKeyDown={onSubmitEditingTodo}
        readOnly={!isEdit}
        size={1}
        value={editValue}
      />

      <button
        className="shrink-0 pt-1 font-mono text-xl text-gray-200 group-hover:text-gray-500"
        onClick={onEditButtonClick}
        type="button"
      >
        ✎
      </button>

      <button
        className="active: shrink-0 text-2xl text-red-100  group-hover:text-red-500"
        onClick={onClearTodoClick(todo.id)}
        type="button"
      >
        ×
      </button>
    </div>
  );
}

export default Todo;
