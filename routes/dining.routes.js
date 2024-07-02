const {Router}=require('express')
const {addPlace}=require('../controllers/admin.controller')
const {searchPlacesByName,getPlaceAvailability,bookPlace}=require('../controllers/user.controller')
const {isAdmin}=require('../middlewares/authJwt')
const router = Router()

router.post('/create',[isAdmin],addPlace)
router.get('/',searchPlacesByName)
router.get('/availability',getPlaceAvailability)
router.post('/book',bookPlace)

module.exports=router