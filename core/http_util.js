function response(res, status, message, data) {
  res.writeHead(status, message, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}
function httpOk(res, data) {
  response(res, 200, "OK", data);
}
function httpCreated(res, data) {
  response(res, 201, "Created", data);
}
function httpUnauthorized(res, info) {
  response(res, 401, "Unauthorized", {
    ...(info || { message: "Unauthorized" }),
    code: 401,
  });
}

function httpBadRequest(res, data) {
  response(res, 400, "Bad Request", data);
}
function httpPageNotFound(res) {
  response(res, 404, "Page Not Found", {});
}
function httpNoContent(res) {
  response(res, 204, "No Content", {});
}

function getReqBodyJson(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    } catch (error) {}
  });
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

export {
  httpOk,
  httpUnauthorized,
  httpBadRequest,
  httpPageNotFound,
  httpNoContent,
  getReqBodyJson,
  getBearerAuthorization,
  httpCreated,
};
