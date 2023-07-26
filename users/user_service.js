import { jwtKey } from "./user_controller.js";
import {
  deleteUser,
  insertUser,
  selectAllUsers,
  selectUserById,
  updateUser,
  findUserByEmail,
  findUserForLogin,
  blockUser,
} from "./user_repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserInterface = { id: "number", email: "email", password: "string" };

const validateEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

function validateUser(user) {
  for (const [key, value] of Object.entries(UserInterface)) {
    if (typeof user[key] !== value) {
      let vaildEmail = validateEmail(user?.[key]);

      if (value !== "email" || !vaildEmail) {
        return {
          done: false,
          message:
            !vaildEmail && value === "email"
              ? `bad ${key} structure`
              : `should include ${key}`,
        };
      }
    }

    if (user[key].length < 1) {
      return {
        done: false,
        message: `${key} is Empty`,
      };
    }
  }

  return { done: true };
}

function getAllUsers() {
  return selectAllUsers();
}

async function createUser(user) {
  let requireAndUser = validateUser({ ...user, id: 0 });
  if (requireAndUser.done) {
    var token = jwt.sign(
      {
        user: user?.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      jwtKey
    );
    user = {
      ...user,
      [Symbol.for("password")]: await bcrypt.hash(user?.password, 10),
      [Symbol.for("done")]: true,
      jwt: token,
    };
    delete user.password;
    return insertUser(user);
  } else return requireAndUser;
}

function editUser(user) {
  if (validateUser) return updateUser(user);
  else return false;
}

function getUserById(id) {
  return selectUserById(id);
}

function removeUser(id) {
  return deleteUser(id);
}

function userIsExist(email) {
  return findUserByEmail(email);
}
async function blockOrUnBlock(user) {
  user = await blockUser(user);
  if (user) {
    return true;
  } else {
    return false;
  }
}
async function getUserEmailAndPass(user) {
  let userRepo = await findUserForLogin(user);
  if (userRepo.length > 0) {
    let isValid = await bcrypt.compare(user?.password, userRepo[0].password);
    console.log(JSON.parse(userRepo[0].locked));
    if (isValid && !JSON.parse(userRepo[0].locked)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
export {
  getAllUsers,
  createUser,
  editUser,
  getUserById,
  removeUser,
  blockOrUnBlock,
  userIsExist,
  getUserEmailAndPass,
};
