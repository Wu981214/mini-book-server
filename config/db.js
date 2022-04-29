//连接数据库信息
const mysql = require('mysql');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456", //填写自己的数据库密码
  database: "minibookserver", //填写自己的数据库名
  port: 3306 //数据库运行对应的端口
});


module.exports = pool;