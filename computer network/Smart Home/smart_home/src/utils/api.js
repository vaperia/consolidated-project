export async function api(base, path, method = "GET") {
  const res = await fetch(`${base}${path}`, { method });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}