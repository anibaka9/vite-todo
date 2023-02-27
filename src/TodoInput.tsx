import { useCallback, useState } from 'react';

interface TodoInputProps {
  readonly addTodo: (text: string) => void;
}

function TodoInput({ addTodo }: TodoInputProps) {
  const [value, setValue] = useState<string>('');

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    []
  );

  const onSubmit = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        addTodo(value);
        setValue('');
      }
    },
    [addTodo, value]
  );

  return (
    <input
      className="w-full rounded-lg border border-gray-400 bg-white p-3 shadow-md placeholder:italic placeholder:text-slate-400"
      onChange={onInputChange}
      onKeyDown={onSubmit}
      placeholder="Whats needs to be done?"
      value={value}
    />
  );
}

export default TodoInput;
