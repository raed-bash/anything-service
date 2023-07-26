import mysql from "mysql";
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test1",
});
export default con;
