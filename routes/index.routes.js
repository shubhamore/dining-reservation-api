const { Router } = require('express');
// const userRouter = require('./user.routes');
const userSignupRouter = require('./usersignup.routes');
const userLoginRouter = require('./userlogin.routes');
const adminRouter = require('./admin.routes');
const diningRouter = require('./dining.routes');
const router = Router();

router.use('/signup', userSignupRouter);
router.use('/login', userLoginRouter)
router.use('/admin',adminRouter)
router.use('/dining-place', diningRouter)

module.exports = router;
