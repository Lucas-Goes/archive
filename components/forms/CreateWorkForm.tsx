"use client";

import { createWork } from "@/app/actions/work";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateWorkForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (loading) return;

    setLoading(true);

    await createWork(formData);

    router.refresh();
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4 p-4 border rounded-xl">

      <input name="title" placeholder="Título" required className="w-full p-2 border rounded" />

      <select name="type" className="w-full p-2 border rounded">
        <option value="movie">Filme</option>
        <option value="series">Série</option>
        <option value="book">Livro</option>
        <option value="game">Jogo</option>
        <option value="anime">Anime</option>
        <option value="manga">Mangá</option>        
        <option value="hq">HQ</option>        
      </select>

      <select name="status" className="w-full p-2 border rounded">
        <option value="want">Quero ver</option>
        <option value="in_progress">Em andamento</option>
        <option value="finished">Finalizado</option>
      </select>

      <input name="rating" type="number" min="1" max="5" placeholder="Nota (1-5)" className="w-full p-2 border rounded" />

      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}