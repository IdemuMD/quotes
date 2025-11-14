const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

router.get('/', heroController.index);
router.get('/new', heroController.new);
router.post('/', heroController.create);
router.get('/search', heroController.search);
router.get('/:id', heroController.show);
router.get('/:id/edit', heroController.edit);
router.put('/:id', heroController.update);
router.delete('/:id', heroController.delete);

module.exports = router;
