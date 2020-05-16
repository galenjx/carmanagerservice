const express = require('express')
const multer = require('multer')
const router = express.Router()
const personal_session = require('./routes/personal_session')
const car = require('./routes/car')
const mantopic = require('./routes/mantopic')


//+================================================================新逻辑========================================================

//+=================================================================personal===========================================
//登录
router.post('/login', personal_session.login_post)//===============√√√√√√√√
//注册
router.post('/register', personal_session.register_post)//===============√√√√√√√√
//更改个人信息
router.post('/user_edit', personal_session.user_edit)//===========√√√√√√√√
//获取个人信息
router.get('/usermes_get', personal_session.user_message_get)//===========√√√√√√√√
//推出登录
router.get('/logout', function (req, res) { req.session.user = null; res.status(200).json({
    err_code: 1,
    message: '退出登录成功'
  }) })
// 个人车辆记录
router.get('/personal_car_list', car.personal_car_list)//========√√√√√√√√

//+===============================================================manager===========================================
//+=====================================车辆===========================================
// 渲染所有车辆
router.get('/settings/edit_post_list', car.allcar_list_get)//========√√√√√√√√
//分类渲染车辆
router.post('/category_car_list_post', car.category_car_list_post)//========√√√√√√√√
// 新增车辆
router.post('/posts/new', car.post_new_car)//=========√√√√√√√√
//更改车辆信息
router.post('/topic/editp', car.post_edit_car)//===========√√√√√√√√
//删除车辆
router.get('/posts_delete_post', car.posts_delete_car)//==========√√√√√√√√
//更改车辆信息页面
router.get('/topic/edit', car.get_edit_car)//============√√√√√√√√
//代处理车辆数据
router.get('/topic/uncar_edit_get', car.uncar_edit_get)//============√√√√√√√√
//代处理车辆数据列表
router.get('/settings/edit_uncar_list_get', car.uncar_list_get)//========√√√√√√√√

//+=====================================搜索===========================================
router.get('/search_get', car.search_get)//========√√√√√√√√
//+=====================================校园区域===========================================
//新增分类
router.post('/category/new', mantopic.addcategory_post)//=========√√√√√√√√
//更改分类
router.post('/category/edit', mantopic.category_edit)//=========√√√√√√√√
//查看分类
router.get('/category/get', mantopic.category_get)//=========√√√√√√√√
// 删除分类
router.get('/category/delete', mantopic.category_delete)//=========√√√√√√√√

//+=====================================综合信息===========================================
router.get('/category/get_carnum', car.get_carnum)//=========√√√√√√√√


module.exports = router
