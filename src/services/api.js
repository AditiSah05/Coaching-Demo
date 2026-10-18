// Browser-side calls to the site's own server.

export class ApiError extends Error {
  constructor(message, status, fields) { super(message); this.status = status; this.fields = fields || {}; }
}

export async function request(url, { method = 'GET', body, form } = {}) {
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw new ApiError(data?.error || 'Something went wrong. Please try again.', res.status, data?.fields);
  return data;
}

// Used by the public forms. Each returns the saved record, or throws an ApiError with per-field messages.
export const api = {
  submitEnquiry: (payload) => request('/api/forms/enquiry', { method: 'POST', body: payload }).then((d) => d.record),
  submitAdmission: (payload) => request('/api/forms/admission', { method: 'POST', body: payload }).then((d) => d.record),
  submitReview: (payload) => request('/api/forms/review', { method: 'POST', body: payload }),
};
