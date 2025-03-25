import sqlite3 from 'sqlite3';

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
  const ip = req.socket.remoteAddress || 'unknown';
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
