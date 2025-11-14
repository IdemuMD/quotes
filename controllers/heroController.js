const Hero = require('../models/hero-model');

exports.index = async (req, res) => {
  try {
    const heroes = await Hero.find();
    res.render('heroes/index', { heroes });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.show = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).send('Hero not found');
    res.render('heroes/show', { hero });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.new = (req, res) => {
  res.render('heroes/new');
};

exports.create = async (req, res) => {
  try {
    // Handle powers, associates, enemies as arrays
    if (req.body.powers) {
      req.body.powers = req.body.powers.split(',').map(p => p.trim()).filter(p => p);
    } else {
      req.body.powers = [];
    }
    if (req.body.associates) {
      req.body.associates = req.body.associates.split(',').map(a => a.trim()).filter(a => a);
    } else {
      req.body.associates = [];
    }
    if (req.body.enemies) {
      req.body.enemies = req.body.enemies.split(',').map(e => e.trim()).filter(e => e);
    } else {
      req.body.enemies = [];
    }

    const hero = new Hero(req.body);
    await hero.save();
    res.redirect('/heroes');
  } catch (error) {
    res.status(400).render('heroes/new', { error: error.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).send('Hero not found');
    res.render('heroes/edit', { hero });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).send('Hero not found');

    // Handle powers, associates, enemies as arrays
    if (req.body.powers) {
      req.body.powers = req.body.powers.split(',').map(p => p.trim()).filter(p => p);
    } else {
      req.body.powers = [];
    }
    if (req.body.associates) {
      req.body.associates = req.body.associates.split(',').map(a => a.trim()).filter(a => a);
    } else {
      req.body.associates = [];
    }
    if (req.body.enemies) {
      req.body.enemies = req.body.enemies.split(',').map(e => e.trim()).filter(e => e);
    } else {
      req.body.enemies = [];
    }

    await Hero.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/heroes');
  } catch (error) {
    const hero = await Hero.findById(req.params.id);
    res.status(400).render('heroes/edit', { error: error.message, hero });
  }
};

exports.delete = async (req, res) => {
  try {
    await Hero.findByIdAndDelete(req.params.id);
    res.redirect('/heroes');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.search = async (req, res) => {
  try {
    const query = req.query.q;
    const heroes = await Hero.find({
      $or: [
        { alterEgo: new RegExp(query, 'i') },
        { realName: new RegExp(query, 'i') },
        { citizenship: new RegExp(query, 'i') }
      ]
    });
    res.render('heroes/search', { heroes, query });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
