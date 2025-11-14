const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  alterEgo: { type: String, required: true, unique: true },
  realName: { type: String, required: true },
  age: { type: Number, required: true },
  birthYear: { type: Number, required: true },
  fullTimeHero: { type: Boolean, required: true },
  alignment: { type: String, enum: ['hero', 'villain', 'neutral'], required: true },
  powers: [{ type: String }],
  associates: [{ type: String }],
  enemies: [{ type: String }],
  nemesis: { type: String },
  citizenship: { type: String, required: true },
  backgroundStory: { type: String, required: true }
}, { collection: 'heroes' });

module.exports = mongoose.model('Hero', heroSchema);
