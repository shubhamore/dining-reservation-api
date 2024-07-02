const { Router } = require('express');
const { userLogin } = require('../controllers/user.controller');
const router = Router();

router.get('/', (req, res) => {
    res.send('Hello from signup routes');
});
router.post('/',userLogin)

module.exports = router;
