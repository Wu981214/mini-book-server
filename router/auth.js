const router = require('express').Router();
const pool = require('../config/db');
const { getToken } = require('../util/common');

router.post('/login', (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  pool.getConnection((err, connection) => { // 获取连接
    if (err) {
      console.log(err);
    } else {
      connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results)
        if (results.length > 0) {
          res.json({
            code: 200,
            success: true,
            msg: 'ok',
            token: getToken(results[0].userid)
          });
        } else {
          res.json({ code: 400, msg: '用户名或密码错误', success: false });
        }
      })
    }
  })
})

module.exports = router;