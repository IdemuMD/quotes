const Quote = require('../models/quote-model');

exports.index = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.render('quotes/index', { quotes });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.show = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).send('Quote not found');
    res.render('quotes/show', { quote });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.new = (req, res) => {
  res.render('quotes/new');
};

exports.create = async (req, res) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();
    res.redirect('/quotes');
  } catch (error) {
    res.status(400).render('quotes/new', { error: error.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).send('Quote not found');
    res.render('quotes/edit', { quote });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).send('Quote not found');

    await Quote.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/quotes');
  } catch (error) {
    const quote = await Quote.findById(req.params.id);
    res.status(400).render('quotes/edit', { error: error.message, quote });
  }
};

exports.delete = async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.redirect('/quotes');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.search = async (req, res) => {
  try {
    const query = req.query.q;
    const quotes = await Quote.find({
      $or: [
        { text: new RegExp(query, 'i') },
        { author: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') }
      ]
    });
    res.render('quotes/search', { quotes, query });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
