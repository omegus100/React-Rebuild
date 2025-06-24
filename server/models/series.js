const mongoose = require('mongoose')

const seriesSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true
  },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    firstName: {type: String},
    lastName: {type: String}
  },
})

// module.exports = mongoose.model('Series', seriesSchema)
export default router;