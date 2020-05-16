
const Category = require('../models/topic')

const mongoose = require('mongoose')

const category_get = function (req, res, next) {
  if (!req.session.user)
      return res.status(200).json({
          err_code: 4,
          message: '请登录'
        })

  Category
      .find({
      })
      .sort({ _id: -1 })
      .then(function (lists) {
          res.status(200).json({
              // user: req.session.user,
              lists: lists
          })
          
      })
      .catch((err) => next(err))
}


const addcategory_post = function (req, res, next) {

  if (!req.session.user||req.session.user.status!=1)
      return res.status(200).json({
          err_code: 4,
          message: '没有权限'
        })
        
    let body = req.body
    Category.findOne({
      
        name: body.name

    }, function (err, data) {
      if (err) {
        // 交给处理错误的中间件
        return next(err)
      }
      if (data) {
        // 手机号或者昵称已存在
        return res.status(200).json({
          err_code: 1,
          message: '分类已存在，请重新输入分类'
        })
      }
  
      new Category(body).save(function (err, user) {
        if (err) {
          return next(err)
        }
  
        res.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      })
    })
  }
  

  const category_delete = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })
    let id = req.query.id.replace(/"/g, '')
    let Oid = mongoose.Types.ObjectId(id);
    Category.remove({
        _id: Oid,
    }, function (err) {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}
  
const category_edit = function (req, res, next) {

  if (!req.session.user||req.session.user.status!=1)
      return res.status(200).json({
          err_code: 4,
          message: '没有权限'
        })

  let body = req.body
  let name = body.name
  body.last_modified_time = Date.now()

  Category.findOneAndUpdate(
      {
        name: name,
      },
      {
          $set: body
      },
      function (err) {
          if (err) {
              return next(err)
          }
          res.status(200).json({
              err_code: 0,
              message: 'OK'
          })

      })
}
  module.exports = {
    addcategory_post,
    category_get,
    category_delete,
    category_edit
  }