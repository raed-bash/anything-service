import jwt from "jsonwebtoken";
import {
  getReqBodyJson,
  httpBadRequest,
  httpCreated,
  httpNoContent,
  httpOk,
  httpUnauthorized,
} from "../core/http_util.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  removeUser,
  editUser,
  userIsExist,
  getUserEmailAndPass,
  blockOrUnBlock,
} from "./user_service.js";
var jwtKey = "myKey";

async function postLogin(req, res) {
  getReqBodyJson(req).then(async (user) => {
    let isValidUser = await getUserEmailAndPass(user);
    if (isValidUser) {
      var token = jwt.sign(
        {
          user: user.email,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        jwtKey
      );
      httpOk(res, { jwt: token });
    } else {
      httpUnauthorized(res, { message: "Bad Credentials" });
    }
  });
}
async function getUsers(req, res) {
  const users = await getAllUsers();
  if (users) {
    httpOk(res, users);
  } else {
    httpNoContent(res);
  }
}
async function postUser(req, res) {
  let originUser = await getReqBodyJson(req)
    .then((user) => user)
    .catch((err) => false);
  const userExist = await userIsExist(originUser?.email);
  if (userExist.length > 0) {
    return httpBadRequest(res, {
      message: "Email Is already Exist",
      user: userExist[0],
    });
  }
  if (originUser) {
    let user = await createUser(originUser);
    if (user[Symbol.for("done")]) {
      httpCreated(res, user);
    } else {
      httpBadRequest(res, { user: originUser });
    }
  } else {
    httpBadRequest(res, { message: "Bad Request" });
  }
}
async function patchUser(req, res) {
  let originUser = await getReqBodyJson(req).catch((err) =>
    httpBadRequest(res, { message: err })
  );
  let user = await editUser(originUser);
  if (user) {
    httpOk(res, user);
  } else {
    httpBadRequest(res, { message: "Bad User Structure", user: originUser });
  }
}
async function getUser(req, res) {
  let userId = req.url.substring("/users/".length);
  if (userId) {
    const user = await getUserById(userId);
    if (user?.length) {
      httpOk(res, user);
    } else {
      httpBadRequest(res, { message: "User Not Found", userId: userId });
    }
  } else {
    httpBadRequest(res, { message: "Bad User Id", userId: userId });
  }
}
async function deleteUser(req, res) {
  let userId = req.url.substring("/users/".length);

  if (userId) {
    const user = await getUserById(userId);
    if (user?.length) {
      if (await removeUser(userId))
        httpOk(res, { ...user[0], deletedDate: new Date() });
    } else {
      httpBadRequest(res, { message: "User Not Found", userId: userId });
    }
  } else {
    httpBadRequest(res, { message: "Bad User Id", userId: userId });
  }
}
async function postBlock(req, res) {
  let blockUser = await getReqBodyJson(req).catch((err) =>
    httpBadRequest(res, { message: err })
  );
  if (blockOrUnBlock(blockUser)) {
    httpOk(res, {
      message: `${
        blockUser.locked ? "Blocked Successfully" : "unBlocked Successfully"
      }`,
    });
  } else {
    httpBadRequest(res, { message: "Bad block" });
  }
}

export {
  postLogin,
  getUsers,
  getUser,
  postUser,
  patchUser,
  deleteUser,
  postBlock,
  jwtKey,
};
