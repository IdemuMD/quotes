
const Hero = require('../models/hero-model');

const index_render = async (req, res) => {
    try {
        const heroes = await Hero.find();
        res.render("index", { heroes });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    index_render
}
