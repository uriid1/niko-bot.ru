import sqlite3 from 'sqlite3';
import url from 'url';
import ResponseType from '#src/enums/ResponseType.js';

const db = new sqlite3.Database('./requests.db');

async function getRequests(req, res) {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const page = parseInt(parsedUrl.searchParams.get('page'), 10) || 1;
    const pass = parsedUrl.searchParams.get('pass');

    if (pass !== process.env.SQLITE3_PASS) {
      res.error(ResponseType.FORBIDDEN);
      return;
    }

    if (page < 1) {
      res.error(ResponseType.BAD_REQUEST);
      return;
    }

    const limit = 100;
    const offset = (page - 1) * limit;

    db.all(
      `SELECT ip, date, path, method, headers FROM requests ORDER BY date DESC LIMIT ? OFFSET ?`,
      [limit, offset],
      (err, data) => {
        if (err) {
          res.error(ResponseType.INTERNAL_ERROR);

          return;
        }

        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const headers = JSON.parse(row.headers);

          data[i].headers = headers;
        }

        res.json(ResponseType.OK, {
          rows: data,
          per_page: limit,
        });
      }
    );
  }
  catch (err) {
    res.error(ResponseType.INTERNAL_ERROR);
  }
}

export default getRequests;
