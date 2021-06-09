const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

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
    res.send(`
      <script>
        alert('注册成功')
        window.location = '/'
      </script>
    `)
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
      res.send(`
        <script>
          alert('用户名密码匹配成功')
          window.location = '/'
        </script>
      `)
    } else {
      res.send(`
        <script>
          alert('用户名密码匹配失败')
          window.location = '/'
        </script>
      `)
    }
    connection.end()
  })
})

app.post('/api/changepassword', urlencodedParser, (req, res) => {
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
      connection.query(`update sys_user set password = ${req.body.password2} where username = '${req.body.username}'`, function (error, result, fields) {
        if (error) throw error
        res.redirect('/')
      })
    } else {
      res.send(`
        <script>
          alert('用户名或密码错误')
          window.location = '/changepassword'
        </script>
      `)
    }
    connection.end()
  })
})

app.post('/api/profile', upload.single('avatar'), function (req, res, next) {
  // req.file 是 `avatar` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_test'
  })
  connection.connect()
  connection.query(`INSERT INTO sys_user (avator) VALUES ('${req.file.filename}') where username = 201312588103`, function (error, results, fields) {
    if (error) throw error
    res.send(`
      <script>
        alert('已上传')
        window.location = '/upload'
      </script>
    `)
    connection.end()
  })
})

app.listen(8888, () => {
  console.log(`Server has started.`)
})
