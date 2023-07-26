import {
  deleteUser,
  getUser,
  getUsers,
  jwtKey,
  patchUser,
  postBlock,
  postLogin,
  postUser,
} from "../users/user_controller.js";
import {
  getBearerAuthorization,
  httpPageNotFound,
  httpUnauthorized,
} from "./http_util.js";
import jwt from "jsonwebtoken";

export default function Middleware(req, res) {
  var method = req.method.toUpperCase();
  var url = req.url;
  console.log(method);
  console.log(req.headers);

  if (method === "OPTIONS") {
    res.writeHead(204, "No Content", {
      "Access-Control-Allow-Origin": "*",
    });
    res.end();
  } else if ((url === "/users" || url === "/users/") && method === "GET") {
    isLoginIn(req, res, function () {
      getUsers(req, res);
    });
  } else if (
    !isNaN(parseInt(url.substring("/users/".length))) &&
    method === "GET"
  ) {
    isLoginIn(req, res, function () {
      getUser(req, res);
    });
  } else if ((url === "/users" || url === "/users/") && method === "POST") {
    postUser(req, res);
  } else if (url === "/users/block" && method === "POST") {
    isLoginIn(req, res, function () {
      postBlock(req, res);
    });
  } else if ((url === "/users" || url === "/users/") && method === "PATCH") {
    isLoginIn(req, res, function () {
      patchUser(req, res);
    });
  } else if (
    !isNaN(parseInt(url.substring("/users/".length))) &&
    method === "DELETE"
  ) {
    isLoginIn(req, res, function () {
      deleteUser(req, res);
    });
  } else if (url === "/login" && method === "POST") {
    postLogin(req, res);
  } else {
    httpPageNotFound(res);
  }
}
function isLoginIn(req, res, fun) {
  const token = getBearerAuthorization(req);
  const islogin = function () {
    if (token) {
      try {
        jwt.verify(token, jwtKey);
        return true;
      } catch (err) {}
    } else {
      return false;
    }
  };
  console.log("islogin", islogin());

  if (islogin()) {
    fun();
  } else {
    httpUnauthorized(res);
  }
}
