import http from "http";
import mysql from "mysql";
import jwt from "jsonwebtoken";
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test1",
});
var jwtKey = "myKey";
http
  .createServer(function (req, res) {
    var method = req.method.toUpperCase();
    var url = req.url;
    console.log(method);
    console.log(req.headers);
    if (url === "/users" && method === "GET") {
      if (isLoginIn(req, res)) {
        getUsers(req, res);
      } else {
        response(res, 401, "Unauthorized");
      }
    } else if (url === "/users" && method === "POST") {
      postUser(req, res);
    } else if (url === "/login" && method === "POST") {
      postLogin(req, res);
    } else {
      response(res, 404, "Page Not Found", {});
    }
  })
  .listen(8080);

function getReqBodyJson(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const data = JSON.parse(body);
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}
function response(res, status, message, data) {
  res.writeHead(status, message, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function getUsers(req, res) {
  con.query(`SELECT * FROM table1`, function (err, result) {
    if (err) throw err;
    console.log("users: " + result);
    response(res, 200, "OK", result);
  });
}
function postUser(req, res) {
  getReqBodyJson(req)
    .then((user) => {
      con.query(
        `INSERT INTO table1 (email,password) VALUES ('${user.email}', '${user.password}')`,
        function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: ");
          console.log("ID: " + result.insertId);
          response(res, 200, "OK", { ...user, id: result.insertId });
        }
      );
    })
    .catch((error) => console.log(error));
}

function postLogin(req, res) {
  getReqBodyJson(req).then((user) => {
    if (
      user &&
      user.email === "raed@gmail.com" &&
      user.password === "0968250552"
    ) {
      var token = jwt.sign(
        {
          user: "raed",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        jwtKey
      );
      response(res, 200, "Ok", { jwt: token });
    } else {
      response(res, 401, "Unauthorized");
    }
  });
}
function isLoginIn(req, res) {
  const token = getBearerAuthorization(req);
  if (token) {
    try {
      jwt.verify(token, jwtKey);
      return true;
    } catch (err) {}
  } else {
    false;
  }
}
function getBearerAuthorization(req) {
  if (req.headers["authorization"]) {
    const authorization = req.headers["authorization"];
    if (authorization.startsWith("Bearer ")) {
      return authorization.substring("Bearer ".length);
    }
  }
  return undefined;
}
