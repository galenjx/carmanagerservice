var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/mancarsys',{ useNewUrlParser: true,useUnifiedTopology: true })

var Schema = mongoose.Schema

var categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  num: {
    type: Number,
    required: true
  },
  created_time: {
    type: Date,
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('Category', categorySchema)
