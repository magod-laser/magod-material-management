let mysql = require("mysql2");

require("dotenv").config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPort = process.env.DB_PORT;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabase1 = process.env.DB_DATABASE_1; //magodmis
const dbDatabase2 = process.env.DB_DATABASE_2; //magod_setup
const dbDatabase6 = process.env.DB_DATABASE_6; //magod_mtrl

let misConn = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  port: dbPort,
  password: dbPassword,
  database: dbDatabase1,
});

let setupConn = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  port: dbPort,
  password: dbPassword,
  database: dbDatabase2,
});

let mtrlConn = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  port: dbPort,
  password: dbPassword,
  database: dbDatabase6,
});

let misQueryMod = async (q, values, callback) => {
  misConn.connect();
  misConn.query(q, values, (err, res, fields) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

let mtrlQueryMod = async (q, values, callback) => {
  mtrlConn.connect();
  mtrlConn.query(q, values, (err, res, fields) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

let setupQueryMod = async (q, values, callback) => {
  setupConn.connect();
  setupConn.query(q, values, (err, res, fields) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

module.exports = {
  misQueryMod,
  mtrlQueryMod,
  setupQueryMod,
};
