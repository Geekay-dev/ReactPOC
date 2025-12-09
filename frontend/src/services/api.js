const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5084";

async function request(path, opts = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  if (res.status === 204) return null;
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

export const api = {
  listUsers: () => request("/api/users"),
  getUser: (id) => request(`/api/users/${id}`),
  createUser: (payload) => request("/api/users", { method: "POST", body: JSON.stringify(payload) }),
  updateUser: (id, payload) => request(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteUser: (id) => request(`/api/users/${id}`, { method: "DELETE" }),
};
