import http from "http";
import Middleware from "./core/middleware.js";

http.createServer((req, res) => Middleware(req, res)).listen(8081);

// function patchUser(req, res) {
//   getReqBodyJson(req)
//     .then((user) => {
//       con.query(
//         `UPDATE table1 SET email='${user.email}', password='${user.password}' WHERE table1.id='${user.id}'`,

//         function (err, result) {
//           if (err) throw err;
//           console.log(result);
//           httpOk(res, user);
//         }
//       );
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
// function deleteUser(req, res) {
//   let id = req.url.substring("/users/".length);
//   let user = {};
//   con.query(`SELECT * FROM table1 WHERE id='${id}'`, function (err, result) {
//     if (err) throw err;
//     console.log(result);
//     user = { ...result[0] };
//   });
//   con.query(
//     `DELETE FROM table1 WHERE table1.id='${id}'`,
//     function (err, result) {
//       if (err) throw err;
//       if (result.affectedRows === 0) {
//         response(res, 400, `ID Not Found: ${id} `, {
//           code: 400,
//           message: "ID Not Found " + id,
//         });
//       } else {
//         response(res, 200, `DELETE ID: ${id}`, [
//           {
//             ...user,
//             deleteDate: new Date(),
//           },
//         ]);
//       }
//     }
//   );
// }
// function getUser(req, res) {
//   let id = req.url.substring("/users/".length);
//   con.query(`SELECT * FROM table1 WHERE id='${id}'`, function (err, result) {
//     if (err) throw err;
//     if (result.length === 0) {
//       return response(res, 400, `ID Not Found: ${id}`, {
//         code: 400,
//         message: `ID Not Found ${id}`,
//       });
//     }
//     response(res, 200, "OK", result);
//   });
// }
// function getUsers(req, res) {
//   con.query(`SELECT * FROM table1`, function (err, result) {
//     if (err) throw err;
//     if (result.length > 0) {
//       response(res, 200, "OK", result);
//     } else {
//       response(res, 204, "No Content", {});
//     }
//   });
// }
// function postUser(req, res) {
//   getReqBodyJson(req)
//     .then((user) => {
//       bcrypt
//         .hash(user?.password, 10)
//         .then((hash) => {
//           console.log("hash pass", hash);
//           user = { ...user, password: hash };
//           validateUser();
//           con.query(
//             `INSERT INTO table1 (email,password) VALUES ('${user.email}', '${user.password}')`,
//             function (err, result) {
//               if (err) throw err;
//               console.log("Number of records inserted: ");
//               console.log("ID: " + result.insertId);
//               response(res, 201, "Created", { ...user, id: result.insertId });
//             }
//           );
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//     .catch((error) => console.log(error));
// }

// function postLogin(req, res) {
//   getReqBodyJson(req).then((user) => {
//     if (
//       user &&
//       user.email === "raed@gmail.com" &&
//       user.password === "0968250552"
//     ) {
//       var token = jwt.sign(
//         {
//           user: "raed",
//           iat: Math.floor(Date.now() / 1000),
//           exp: Math.floor(Date.now() / 1000) + 60 * 60,
//         },
//         jwtKey
//       );
//       response(res, 200, "Ok", { jwt: token });
//     } else {
//       response(res, 401, "Unauthorized");
//     }
//   });
// }

// function validateUser(hash) {
//   bcrypt
//     .compare(
//       "raded",
//       "$2b$10$AMvC3z22cQ2bfYjDUmK.9OyJXohIJ6XMO1WlkWYRAtf2P27UrCLuO"
//     )
//     .then((res) => {
//       console.log("compare", res); // return true
//     })
//     .catch((err) => console.error(err.message));
// }
