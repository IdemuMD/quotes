
const Quote = require('../models/quote-model');

const index_render = async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.render("index", { quotes });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    index_render
}
