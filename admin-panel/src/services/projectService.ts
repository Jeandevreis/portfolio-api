export const ProjectService = {
  async getAll() {
    const res = await fetch("/api/projects", { credentials: "include" });
    if (!res.ok) throw new Error("Falha ao buscar dados.");
    return res.json();
  },

  async getById(id: string) {
    const res = await fetch(`/api/projects/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Erro ao buscar projeto.");
    return res.json();
  },

  async create(payload: Partial<Project>) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Erro ao criar.");
    return res.json();
  },

  async update(id: string, payload: Partial<Project>) {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Erro ao atualizar.");
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Erro ao excluir.");
    return res.json();
  }
};