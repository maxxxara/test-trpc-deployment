import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./lib/trpc";
import { httpBatchLink } from "@trpc/client";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => 
    trpc.createClient({
      links: [
        httpBatchLink({ url: "http://localhost:8080/trpc" }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

function AppContent() {
  const { data, isLoading, refetch } = trpc.todo.getTodos.useQuery();
  const [input, setInput] = useState("");
  useEffect(() => {
    console.log('data', data);
  }, [data]);

  const createTodo = trpc.todo.createTodo.useMutation({
    onSuccess: () => {
      refetch();
      setInput("");
    }
  });

  const handleCreateTodo = () => {
    if (!input.trim()) return;
    createTodo.mutate({ title: input });
  }

  return (
    <div className='max-w-xl mx-auto'>
      {isLoading ? <div>Loading...</div> : <div>{data?.map((todo) => <div key={todo.id} className="flex justify-between items-center">
        <div>{todo.title}</div>
        <div>{todo.completed ? "Completed" : "Not Completed"}</div>
      </div>)}</div>}
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => {
        handleCreateTodo();
      }}>Create Todo</button>
    </div>
  );
}

export default App
