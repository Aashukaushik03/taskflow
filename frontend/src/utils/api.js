const API_BASE = 'http://localhost:5000/api/v1';

const getToken = () => localStorage.getItem('token');

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const request = async (method, url, body = null) => {
  const options = { method, headers: buildHeaders() };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${API_BASE}${url}`, options);
  const data = await response.json();
  return data;
};

export const api = {
  get:    (url)       => request('GET', url),
  post:   (url, body) => request('POST', url, body),
  put:    (url, body) => request('PUT', url, body),
  delete: (url)       => request('DELETE', url),
};