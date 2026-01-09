const sessions = new Map();

export function getSession(id) {
  return sessions.get(id) || [];
}

export function saveSession(id, message) {
  const history = sessions.get(id) || [];
  history.push(message);
  sessions.set(id, history.slice(-6));
}
