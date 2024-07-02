const { Router } = require('express');
const { userSignup } = require('../controllers/user.controller');
const router = Router();

router.get('/', (req, res) => {
    res.send('Hello from signup routes');
});
router.post('/',userSignup)

module.exports = router;
