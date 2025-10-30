import { config, devLog } from '../config/appConfig';

export async function uploadProductImages(files, token, baseUrl, fieldName) {
  if (!files || files.length === 0) throw new Error('Seleccioná al menos una imagen');

  const form = new FormData();
  const field = fieldName || import.meta?.env?.VITE_UPLOAD_FIELD_NAME || 'images';
  Array.from(files).forEach((f) => form.append(field, f));

  const apiBase = baseUrl || config.API_BASE_URL || '';
  const url = `${apiBase}/products/upload`;
  devLog('uploadProductImages - Enviando upload', { url, field, files: Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type })), hasToken: !!token });
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });

  if (!res.ok) {
    let err = {};
    let text = '';
    try { text = await res.text(); err = text ? JSON.parse(text) : {}; } catch { /* ignore */ }
    devLog('uploadProductImages - Error', { status: res.status, statusText: res.statusText, body: text?.slice?.(0, 500) });
    throw new Error(err?.message || `Error subiendo imágenes (status ${res.status})`);
  }
  const json = await res.json();
  devLog('uploadProductImages - OK', json);
  return json;
}

export default uploadProductImages;


