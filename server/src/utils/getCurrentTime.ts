export function getCurrentTime() {
  const now = new Date();

  return now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}
