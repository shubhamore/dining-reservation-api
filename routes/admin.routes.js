const { Router } = require('express');
const { login, signup } = require('../controllers/admin.controller');
const router = Router();

router.get('/', (req, res) => {
    res.send('Hello from signup routes');
});
router.post('/signup',signup)
router.post('/login',login)

module.exports = router;
