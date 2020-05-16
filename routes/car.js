
const Car = require('../models/car')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

//个人车辆渲染
const personal_car_list = function (req, res, next) {
    if (!req.session.user||req.session.user.phonenumber!=req.query.phonenumber)
    return res.status(200).json({
        err_code: 4,
        message: '请登录'
      })
    let phonenumber = req.query.phonenumber
  
    Car.find(
        {
            phonenumber: phonenumber,
            // author_id: user._id
        },
        function (err,data) {
            if (err) {
                return next(err)
            }
            res.status(200).json({
                finalData: data
            })
  
        })
  }




//分类实时在校车辆
const get_carnum = function (req, res, next) {
// if (!req.session.user||req.session.user.status!=1)
// return res.status(200).json({
//     err_code: 4,
//     message: '没有权限'
//   })
console.log(req.query.name)
Car
    .find({
        status: 2,
        area_category_name: req.query.name
        // status: { $gt: 1, $lt: 66 }
    })
    .countDocuments()
    .then(function (count) {
        // console.log(count)
        res.status(200).json({
            count: count
        })
        
    })
    .catch((err) => next(err))
}
//全部车辆渲染
const allcar_list_get = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })
    console.log(req.session.user)
    let pageControl = {}
    Car
        .find({
            status: { $nin: 0}
            // status: { $gt: 1, $lt: 66 }
        })
        .countDocuments()
        .then(function (count) {
            if (count == 0)
                return res.status(200).json({
                    message: '空空如也(*^_^*)'
                })
            let size = 10
            let total_count = count
            let total_page = Math.ceil(total_count / size)
            let page = (JSON.stringify(req.query.page) && !isNaN(parseInt(req.query.page))) ? parseInt(req.query.page) : 1
            if (page < 1) {
                // res.redirect('/settings/edit_post_list?page=1')
                page = 1
            }
            if (page > total_page) {
                // res.redirect('/settings/edit_post_list?page=' + total_page)
                page = total_page
            }
            //计算查询多少,api有点蒙了
            // let query_total = page * size
            //计算越过多少条
            let offset = (page - 1) * size
            // console.log(page,total_page,parseInt(urlObj.query.page))

            //==================================这是用于处理底部页码的数据==========================
            let visiable = 5
            let regin = (visiable - 1) / 2//左右区间
            let begin = page - regin//开始页码
            let end = begin + visiable//结束页码加一
            //可能出现begin,end不合理情况，begin必须大于0
            if (begin < 1) {
                begin = 1
                //这里begin改了end也要修改，用于后期控制按钮数不变;
                end = begin + visiable
            }
            if (end > total_page + 1) {
                //超出范围
                end = total_page + 1
                //begin也做相应更改
                begin = end - visiable
                //但是这里可能页数小于5，重新设置一下
                if (begin < 1) {
                    begin = 1
                }
            }

            //利用begin与end组成一个数组，用于模板便利
            let pageControlLists = []
            for (let i = begin; i < end; i++) {
                pageControlLists.push(i)
            }
            // console.log(page,begin,end,pageControlLists)
            //end必须<=最大页数
            pageControl = {
                pageControlLists: pageControlLists,
                page
            }
            return Car.find({
                // author_id: user._id
                status: { $nin: 0}
            })
                .sort({ _id: -1 })
                .limit(size)
                .skip(offset)
        })
        //这个api不支持类似promise的编程吗？
        .then(function (lists) {
            // lists.forEach(element => {
            //     element.last_modified_time = formatDate(element.last_modified_time)
            // });
            let finalData = {
                pageControl,
                lists
            }
            res.status(200).json({
                // user: req.session.user,
                finalData: finalData
            })
            
        })
        .catch((err) => next(err))
}

//未处理车辆渲染
const uncar_list_get = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })
    let pageControl = {}
    Car
        .find({
            status: 0
        })
        .countDocuments()
        .then(function (count) {
            if (count == 0)
                return res.status(200).json({
                    // user: req.session.user,
                    message: '空空如也(*^_^*)'
                })
            let size = 10
            let total_count = count
            let total_page = Math.ceil(total_count / size)
            let page = (JSON.stringify(req.query.page) && !isNaN(parseInt(req.query.page))) ? parseInt(req.query.page) : 1
            if (page < 1) {
                // res.redirect('/settings/edit_post_list?page=1')
                page = 1
            }
            if (page > total_page) {
                // res.redirect('/settings/edit_post_list?page=' + total_page)
                page = total_page
            }
            //计算查询多少,api有点蒙了
            // let query_total = page * size
            //计算越过多少条
            let offset = (page - 1) * size
            // console.log(page,total_page,parseInt(urlObj.query.page))

            //==================================这是用于处理底部页码的数据==========================
            let visiable = 5
            let regin = (visiable - 1) / 2//左右区间
            let begin = page - regin//开始页码
            let end = begin + visiable//结束页码加一
            //可能出现begin,end不合理情况，begin必须大于0
            if (begin < 1) {
                begin = 1
                //这里begin改了end也要修改，用于后期控制按钮数不变;
                end = begin + visiable
            }
            if (end > total_page + 1) {
                //超出范围
                end = total_page + 1
                //begin也做相应更改
                begin = end - visiable
                //但是这里可能页数小于5，重新设置一下
                if (begin < 1) {
                    begin = 1
                }
            }

            //利用begin与end组成一个数组，用于模板便利
            let pageControlLists = []
            for (let i = begin; i < end; i++) {
                pageControlLists.push(i)
            }
            // console.log(page,begin,end,pageControlLists)
            //end必须<=最大页数
            pageControl = {
                pageControlLists: pageControlLists,
                page
            }
            return Car.find({
                status: 0
            })
                .sort({ _id: -1 })
                .limit(size)
                .skip(offset)
        })
        //这个api不支持类似promise的编程吗？
        .then(function (lists) {
            let finalData = {
                pageControl,
                lists
            }
            res.status(200).json({
                // user: req.session.user,
                finalData: finalData
            })
            
        })
        .catch((err) => next(err))
}

//按分类渲染
const category_car_list_post = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })
    let body = req.body
    let pageControl = {}
    Car
        .find({
            area_category_name: body.mancardata_category_name,
            status: { $nin: 0}
        })
        .countDocuments()
        .then(function (count) {
            if (count == 0)
                return res.status(200).json({
                    // user: req.session.user,
                    message: '空空如也(*^_^*)'
                })
            let size = 10
            let total_count = count
            let total_page = Math.ceil(total_count / size)
            let page = (JSON.stringify(req.body.page) && !isNaN(parseInt(req.body.page))) ? parseInt(req.body.page) : 1
            if (page < 1) {
                // res.redirect('/settings/edit_post_list?page=1')
                page = 1
            }
            if (page > total_page) {
                // res.redirect('/settings/edit_post_list?page=' + total_page)
                page = total_page
            }
            //计算查询多少,api有点蒙了
            // let query_total = page * size
            //计算越过多少条
            let offset = (page - 1) * size
            // console.log(page,total_page,parseInt(urlObj.query.page))

            //==================================这是用于处理底部页码的数据==========================
            let visiable = 5
            let regin = (visiable - 1) / 2//左右区间
            let begin = page - regin//开始页码
            let end = begin + visiable//结束页码加一
            //可能出现begin,end不合理情况，begin必须大于0
            if (begin < 1) {
                begin = 1
                //这里begin改了end也要修改，用于后期控制按钮数不变;
                end = begin + visiable
            }
            if (end > total_page + 1) {
                //超出范围
                end = total_page + 1
                //begin也做相应更改
                begin = end - visiable
                //但是这里可能页数小于5，重新设置一下
                if (begin < 1) {
                    begin = 1
                }
            }

            //利用begin与end组成一个数组，用于模板便利
            let pageControlLists = []
            for (let i = begin; i < end; i++) {
                pageControlLists.push(i)
            }
            // console.log(page,begin,end,pageControlLists)
            //end必须<=最大页数
            pageControl = {
                pageControlLists: pageControlLists,
                page
            }
            return Car.find({
                area_category_name: body.mancardata_category_name,
                status: { $nin: 0}
            })
                .sort({ _id: -1 })
                .limit(size)
                .skip(offset)
        })
        //这个api不支持类似promise的编程吗？
        .then(function (lists) {
            let finalData = {
                pageControl,
                lists
            }
            
            res.status(200).json({
                // user: req.session.user,
                finalData: finalData
            })
            
        })
        .catch((err) => next(err))
}







//添加车辆
const post_new_car = function (req, res, next) {
    if (!req.session.user)
    return res.status(200).json({
        err_code: 4,
        message: '请登录'
      })
    let body = req.body
    if (!body.area_category_name || !body.carnum || !body.car_category || !body.carowner || !body.phonenumber || !body.status)
        return res.status(200).json({
            err_code: 2,
            message: '请填写完整的车辆信息'
        })
    new Car(body).save(function (err, post) {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })

    })

}


//删除车辆
const posts_delete_car = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })
    let id = req.query.id.replace(/"/g, '')
    
    let Oid = mongoose.Types.ObjectId(id);
    Car.remove({
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



//渲染单个车辆
const get_edit_car = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })

    let id = req.query.id.replace(/"/g, '')
    let Oid = mongoose.Types.ObjectId(id);
    Car.findOne({
        _id: Oid,
    }, function (err, result) {
        if (err) {
            // 交给处理错误的中间件
            return next(err)
        }
        res.status(200).json({
            result: result
        })
    })
}



const post_edit_car = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })
    let body = req.body
    let id = body._id.replace(/"/g, '')
    let Oid = mongoose.Types.ObjectId(id);
    if(body.status==2){
        body.enter_time = Date.now()
    }
    if(body.status==3){
        body.leave_time = Date.now()
    }
    Car.findOneAndUpdate(
        {
            _id: Oid,
            // author_id: user._id
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

const uncar_edit_get = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })
    let body = req.query
    let id = body.id.replace(/"/g, '')
    body.status = 1
    let Oid = mongoose.Types.ObjectId(id);
    Car.findOneAndUpdate(
        {
            _id: Oid,
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




const search_get = function (req, res, next) {
    if (!req.session.user||req.session.user.status!=1)
    return res.status(200).json({
        err_code: 4,
        message: '没有权限'
      })

      let carmessage = req.query.carmessage
    Car
        .find({
            $or: [{
                carnum: carmessage
              },
              {
                carowner: carmessage
              },
              {
                phonenumber: carmessage
              }
              ],
            status: { $nin: 0}
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








//+================================================================新逻辑========================================================






module.exports = {
    uncar_edit_get,
    category_car_list_post,
    search_get,
    personal_car_list,
    allcar_list_get,
    uncar_list_get,
    post_new_car,
    posts_delete_car,
    get_edit_car,
    post_edit_car,
    get_carnum
}