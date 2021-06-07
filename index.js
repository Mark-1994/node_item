const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')

app.use(express.static('./static'))

// 解析 application/json 数据
var jsonParser = bodyParser.json()
// 解析 application/x-www-form-urlencoded 数据
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/api/register', urlencodedParser, (req, res) => {
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_test'
  })
  connection.connect()
  connection.query(`INSERT INTO sys_user (username, password) VALUES ('${req.body.username}', '${req.body.password}')`, function (error, results, fields) {
    if (error) throw error
    res.redirect('/')
    connection.end()
  })
})

app.post('/api/login', urlencodedParser, (req, res) => {
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_test'
  })
  connection.connect()
  connection.query(`select * from sys_user where username = ? and password = ?`, [req.body.username, req.body.password], function (error, results, fields) {
    if (error) throw error
    if (results.length > 0) {
      res.send('用户名密码匹配成功')
    } else {
      res.send('用户名密码匹配失败')
    }
    connection.end()
  })
})

app.listen(8888, () => {
  console.log(`Server has started.`)
})
