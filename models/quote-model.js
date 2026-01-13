const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, enum: ['inspiration', 'motivation', 'wisdom', 'humor', 'life', 'love', 'success', 'other'], default: 'other' },
  source: { type: String }, // Where the quote is from (book, speech, interview, etc.)
  dateAdded: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  isFavorite: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { collection: 'quotes' });

module.exports = mongoose.model('Quote', quoteSchema);
