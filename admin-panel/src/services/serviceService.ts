export const ServiceService = {
  async getAll(): Promise<Service[]> {
    const res = await fetch("/api/services", { credentials: "include" });
    if (!res.ok) throw new Error("Falha ao buscar dados.");
    return res.json();
  },

  async getById(id: string): Promise<Service> {
    const res = await fetch(`/api/services/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Erro ao buscar serviço.");
    return res.json();
  },

  async create(payload: Partial<Service>): Promise<Service> {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Erro ao criar.");
    return res.json();
  },

  async update(id: string, payload: Partial<Service>): Promise<Service> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Erro ao atualizar.");
    return res.json();
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error("Erro ao excluir.");
    return res.json();
  }
};
