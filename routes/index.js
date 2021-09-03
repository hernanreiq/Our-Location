const router = require('express').Router();

router.get('/', (req, res) => {
   res.render('index');
});

router.get('/author', (req, res) => {
   res.redirect('https://bit.ly/hernanreiq');
});

module.exports = router;