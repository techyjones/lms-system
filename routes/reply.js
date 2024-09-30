const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    notification: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    replyMessage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reply', replySchema);
