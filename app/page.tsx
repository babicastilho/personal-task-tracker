// app/page.tsx
'use client';
import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <TodoList />
    </main>
  );
}
