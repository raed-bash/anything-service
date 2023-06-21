import http from "http";
import fs from "fs";
http
  .createServer(function (req, res) {
    console.log(req.method);
    console.log(req.headers);

    var url = req.url;
    var users = JSON.parse(fs.readFileSync("users.json"));
    var method = req.method.toUpperCase();

    console.log(req.query);
    if (method === "OPTIONS") {
      res.writeHead(204, "No Content", {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": `${req.headers["access-control-request-method"]}, GET, OPTIONS`,
        "Access-Control-Allow-Headers": `X-PINGOTHER, ${req.headers["access-control-request-headers"]}`,
      });
      res.end();
    } else if ((url === "/users" || url === "/users/") && method === "GET") {
      response(res, 200, "ok", users);
      return;
    }
    // else if ((url === "/users" || url === "/users/") && method === "PATCH") {
    //   console.log("post is runinig");
    //   let body = "";
    //   req.on("data", (chunk) => {
    //     body += chunk.toString();
    //   });
    //   req.on("end", () => {
    //     const data = JSON.parse(body);
    //     const userIndex = users.findIndex((user) => user.id === data.id);
    //     users[userIndex] = data;
    //     fs.writeFileSync("users.json", JSON.stringify(users));
    //     response(res, 201, "ok", data);
    //   });

    //   return;
    // }
    else if ((url === "/users" || url === "/users/") && method === "POST") {
      getReqBodyJson(req)
        .then((newUser) => {
          newUser.id = 0;
          const newId =
            users.length > 0
              ? Math.max(...users.map((user) => user.id)) + 1
              : 1;
          newUser = { ...newUser, id: newId };
          users.push(newUser);
          fs.writeFileSync("users.json", JSON.stringify(users));
          response(res, 201, "ok", newUser);
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }
    //   else if (url.startsWith("/users/") && method === "GET") {
    //   let userId = parseInt(url.substring("/users/".length));
    //   let user = users.find((user) => user.id === userId);
    //   response(res, 200, "ok", user);
    //   return;
    // } else if (url.startsWith("/users/") && method === "DELETE") {
    //   let userId = parseInt(url.substring("/users/".length));
    //   if (userId) {
    //     let userIndex = users.findIndex((user) => user.id == userId);
    //     response(res, 200, "ok", users[userIndex]);
    //     users.splice(userIndex, 1);
    //   } else {
    //     getReqBodyJson(req)
    //       .then((obj) => {
    //         console.log(obj);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   }
    //   return;
    // }
    else response(res, 404, "not Found page", {});
  })
  .listen(8080);
function response(res, status, message, data) {
  res.writeHead(status, message, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}
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

let UserInterface = {
  id: "number",
  name: "string",
  level: "number",
  items: "array",
};

let ItemsInterface = {
  name: "string",
  number: "number",
};

function vailedateItems(user) {
  for (const obj of user.items) {
    if (typeof obj === "object") {
      for (const [key, value] of Object.entries(ItemsInterface)) {
        if (typeof obj?.[key] !== value) {
          console.log(key, value);
          return false;
        }
      }
    }
  }
  return true;
}
