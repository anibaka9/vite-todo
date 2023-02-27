import TodoInput from './TodoInput';
import Todo from './Todo';
import Controls from './Controls';
import useTodos from './hooks/useTodos';
import useMode from './hooks/useMode';

function App() {
  const {
    todos,
    addTodo,
    updateTodo,
    toggleIsDone,
    clearTodo,
    clearCompleted,
  } = useTodos();

  const { filteredTodos, activeMode, setActiveMode } = useMode(todos);

  return (
    <div className="mx-auto max-w-2xl p-5">
      <h1 className=" mb-5 text-2xl font-bold">To-Do list</h1>
      <TodoInput addTodo={addTodo} />
      <div className="mt-5">
        {filteredTodos.map((todo) => (
          <Todo
            clearTodo={clearTodo}
            key={todo.id}
            todo={todo}
            toggleIsDone={toggleIsDone}
            updateTodo={updateTodo}
          />
        ))}
        <Controls
          activeMode={activeMode}
          clearCompleted={clearCompleted}
          setActiveMode={setActiveMode}
          todos={todos}
        />
      </div>
    </div>
  );
}

export default App;
