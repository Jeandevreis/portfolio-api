export const EducationService = {
  async getAll(): Promise<Education[]> {
    const res = await fetch("/api/educations", { credentials: "include" });
    if (!res.ok) throw new Error("Falha ao buscar dados.");
    return res.json();
  },

  async getById(id: string): Promise<Education> {
    const res = await fetch(`/api/educations/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Erro ao buscar formação.");
    return res.json();
  },

  async create(payload: Partial<Education>): Promise<Education> {
    const res = await fetch('/api/educations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Erro ao criar.");
    return res.json();
  },

  async update(id: string, payload: Partial<Education>): Promise<Education> {
    const res = await fetch(`/api/educations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Erro ao atualizar.");
    return res.json();
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/educations/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Erro ao excluir.");
    return res.json();
  }
};