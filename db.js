const sqlite3 = require('sqlite3').verbose();


const openDb = async (path) => {
  return new Promise((res, rej) => {
    let db = new sqlite3.Database(path, (err) => {
      if (err) {
        return rej(err);
      }
      res(db);
    });
  });
}

const createDb = async (db) => {
  return new Promise((res, rej) => {
    db.run(`CREATE TABLE IF NOT EXISTS 
    requests(
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT UNIQUE, 
      password TEXT,
      email TEXT,
      state INTEGER DEFAULT 0
    )`, (err) => {
      if(err) {
        return rej(err);
      }
      db.run(`CREATE INDEX IF NOT EXISTS state_index ON requests (state	ASC)`, (err) => {
        if(err) {
          return rej(err);
        }
        res();
      });
    });
  });
};

const insertRequest = async (db, name, password, email) => {
  const sql = `INSERT INTO requests(name, password, email) VALUES(?,?,?)`;
  return new Promise((res, rej) => {
    db.run(sql, [name, password, email], (err) => {
      if (err) {
        return rej(err);
      }
      res(this.lastID);
      // db.close();
    });
  });
};

const approveRequest = async (db, pk) => {
  const sql = `UPDATE requests SET (state)=(?) WHERE id=?`;
  return new Promise((res, rej) => {
    db.run(sql, [1, pk], (err) => {
      if (err) {
        return rej(err);
      }
      res(this.lastID);
      // db.close();
    });
  });
};

const rejectRequest = async (db, pk) => {
  const sql = `UPDATE requests SET (state)=(?) WHERE id=?`;
  return new Promise((res, rej) => {
    db.run(sql, [2, pk], (err) => {
      if (err) {
        return rej(err);
      }
      res(this.lastID);
      // db.close();
    });
  });
};

const getRequests = async (db, state) => {
  const sql = `SELECT * FROM requests WHERE state=?`;
  return new Promise((res, rej) => {
    db.all(sql, [state], (err, data) => {
      if (err) {
        return rej(err);
      }
      res(data);
    });
  });  
}

const getRequest = async (db, pk) => {
  const sql = `SELECT * FROM requests WHERE id=?`;
  return new Promise((res, rej) => {
    db.get(sql, [pk], (err, data) => {
      if (err) {
        return rej(err);
      }
      res(data);
    });
  });  
}

module.exports = {
  openDb,
  createDb,
  insertRequest,
  approveRequest,
  rejectRequest,
  getRequests,
  getRequest,
}