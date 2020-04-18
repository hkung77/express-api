var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
// res.render('index.html');
    res.send('hello world');
});

module.exports = router;
