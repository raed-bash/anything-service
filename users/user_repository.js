import con from "../config.js";

async function selectAllUsers() {
  return new Promise((resolve, reject) => {
    try {
      con.query(
        `SELECT email, id, reg_date FROM table1`,
        function (err, result) {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        }
      );
    } catch (error) {
      return reject(error);
    }
  });
}

async function insertUser(user) {
  return await new Promise((resolve, reject) => {
    try {
      con.query(
        `INSERT INTO table1 (email,password) VALUES ('${user.email}', '${
          user[Symbol.for("password")]
        }')`,
        async function (err, result) {
          if (err) {
            reject(err);
            throw err;
          }
          resolve({
            ...user,
            ...(await selectUserById(result.insertId))[0],
            locked: "false",
          });
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
}

async function updateUser(user) {
  return await new Promise((resolve, reject) => {
    try {
      con.query(
        `UPDATE table1 SET email='${user.email}', password='${user.password}' WHERE table1.id='${user.id}'`,
        function (err, result) {
          if (err) {
            reject(err);
            throw err;
          }
          console.log(result);
          resolve(user);
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
}
async function selectUserById(id) {
  return await new Promise((resolve, reject) => {
    try {
      con.query(
        `SELECT email, id, reg_date FROM table1 WHERE id='${id}'`,
        function (err, result) {
          if (err) {
            reject(err);
            throw err;
          }
          resolve(result);
        }
      );
    } catch (error) {
      return reject(err);
    }
  });
}
async function blockUser(user) {
  return await new Promise((resolve, reject) => {
    try {
      con.query(
        `UPDATE table1 SET locked='${user.locked}' WHERE table1.id='${user.id}'`,
        function (err, result) {
          if (err) {
            reject(err);
            throw err;
          }
          resolve(user);
        }
      );
    } catch (err) {
      return reject(err);
    }
  });
}
async function deleteUser(id) {
  return await new Promise((resolve, reject) => {
    try {
      con.query(
        `DELETE FROM table1 WHERE table1.id='${id}'`,
        function (err, result) {
          if (err) {
            reject(err);
            throw err;
          }
          resolve(result.affectedRows);
        }
      );
    } catch (error) {
      return reject(err);
    }
  });
}

async function findUserByEmail(email) {
  return await new Promise((resolve, reject) => {
    try {
      con.query(
        `SELECT email, id, reg_date FROM table1 WHERE email="${email}"`,
        function (err, result) {
          if (err) {
            reject(err);
            throw err;
          }
          resolve(result);
        }
      );
    } catch (error) {
      return reject(err);
    }
  });
}
async function findUserForLogin(user) {
  return await new Promise((resolve, reject) => {
    try {
      con.query(
        `SELECT email, password, locked FROM table1 WHERE email="${user.email}"`,
        function (err, result) {
          if (err) {
            reject(err);
            throw err;
          }
          resolve(result);
        }
      );
    } catch (error) {
      return reject(err);
    }
  });
}
export {
  selectAllUsers,
  selectUserById,
  deleteUser,
  insertUser,
  updateUser,
  blockUser,
  findUserByEmail,
  findUserForLogin,
};
