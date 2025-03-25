import sqlite3 from 'sqlite3';

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
}

const db = new sqlite3.Database('./requests.db', (err) => {
  if (err) {
    console.error('Error connect:', err.message);
  }
  else {
    console.log('SQLite3: connceted');
    db.run(`
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        date TEXT,
        path TEXT,
        method TEXT,
        headers TEXT
      )
    `);
  }
});

const logRequest = (req, res) => {
  const { method, url, headers } = req;
  const ip = getClientIp(req) || 'unknown';
  const date = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO requests (ip, date, path, method, headers)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(ip, date, url, method, JSON.stringify(headers), (err) => {
    if (err) {
      console.error('Erorr:', err.message);
    }
  });
  
  stmt.finalize();
};

export default logRequest;
