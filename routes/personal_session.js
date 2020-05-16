
const User = require('../models/user')
const md5 = require('blueimp-md5')

const login_post = function (req, res, next) {
  let body = req.body
  User.findOne({
    phonenumber: body.phonenumber,
    status : body.status,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      // 交给处理错误的中间件
      return next(err)
    }
    // 如果手机号和密码匹配，则 user 是查询到的用户对象，否则就是 null
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: '手机号或者密码错误'
      })
    }
    // 用户存在，登陆成功，通过 Session 记录登陆状态
    req.session.user = user
    res.status(200).json({
      err_code: 0,
      message: 'OK',
      user : req.session.user
    })
  })
}



const register_post = function (req, res, next) {

  let body = req.body

  User.findOne({

      phonenumber: body.phonenumber
    
  }, function (err, data) {
    if (err) {
      // 交给处理错误的中间件
      return next(err)
    }
    if (data) {
      // 手机号或者昵称已存在
      return res.status(200).json({
        err_code: 1,
        message: '手机号已存在，请登录'
      })
    }
    
    body.password = md5(md5(body.password))
    body.status = Number(body.status)
    new User(body).save(function (err, user) {
      if (err) {
        return next(err)
      }

      // 注册成功，使用 Session 记录用户的登陆状态
      req.session.user = user
      // Express 提供了一个响应方法：json，该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    })
  })
}


const user_message_get = function (req, res, next) {
  if (!req.session.user)
  return res.status(200).json({
      err_code: 4,
      message: '请登录!'
    })
  let phonenumber = req.query.phonenumber
  User.findOne({

      phonenumber: phonenumber
    
  }, function (err, data) {
    if (err) {
      // 交给处理错误的中间件
      return next(err)
    }
    if (data) {
      return res.status(200).json({
        err_code: 1,
        data: data
      })
    }
  })
}

const user_edit = function (req, res, next) {
  if (!req.session.user)
  return res.status(200).json({
      err_code: 4,
      message: '请登录!'
    })

  let body = {}

  let origin_password = req.body.origin_password
  body.password = md5(md5(req.body.new_password))
  body.name = req.body.name
  body.gender = req.body.gender
  body.license = req.body.license
  body.remarks = req.body.remarks
  body.phonenumber = req.body.phonenumber
  body.last_modified_time = Date.now()
  console.log(body)

  User.findOneAndUpdate(
      {
        phonenumber: body.phonenumber,
        password: md5(md5(origin_password))
      },
      {
          $set: body
      },
      function (err,user) {

          if (err) {
            // 交给处理错误的中间件
            return next(err)
          }
          // 如果手机号和密码匹配，则 user 是查询到的用户对象，否则就是 null
          if (!user) {
            return res.status(200).json({
              err_code: 1,
              message: '手机号或者原始密码密码错误'
            })
          }
          // 用户存在，登陆成功，通过 Session 记录登陆状态
          // req.session.user = user
          res.status(200).json({
            err_code: 0,
            message: 'OK',
            // user : req.session.user
          })

      })
}

module.exports = {
  login_post,
  register_post,
  user_edit,
  user_message_get
}