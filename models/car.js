var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/mancarsys',{ useNewUrlParser: true,useUnifiedTopology: true })

var Schema = mongoose.Schema

var carSchema = new Schema({
  // author_id: {
  //   type: Schema.Types.ObjectId,
  //   required: true
  // },
  area_category_name: {
    type: String,
    required: true
  },
  carnum: {
      type: String,
      required: true
  },
  car_category: {
    type: String,
    required: true
  },
  carowner: {
    type: String,
    required: true
  },
  phonenumber: {
    type: String,
    required: true
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  enter_time: {
    type: Date,
  },
  leave_time: {
    type: Date,
  },
  time_slot:{
    type: Date
  },
  remark:{
    type:String
  },
  status: {
    type: Number,
    // 0 等待审核
    // 1 等待进入
    // 2 已进入
    // 3 已离开
    enum: [0, 1, 2, 3],
    required: true
    // type: String,
    // required: true
  },
})

module.exports = mongoose.model('Car', carSchema)
