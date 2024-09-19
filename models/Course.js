const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
    trim: true      
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    
    required: true  
  },
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'     
  }]
}, { timestamps: true }); 
module.exports = mongoose.model('Course', courseSchema);
