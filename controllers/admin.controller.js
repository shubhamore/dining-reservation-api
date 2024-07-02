const db=require('../models')
const User=db.user
const Place=db.Place
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=process.env

const signup=async(req,res)=>{
    try{
        const {username,password,email}=req.body
        if(!username||!password){
            return res.status(400).json({error:"Please fill all the fields"})
        }
        const user=await User.findOne({where:{username}})
        if(user){
            return res.status(400).json({error:"User already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,12)
        const newUser=await User.create({username,email,password:hashedPassword,role:"admin"})
        res.status(200).json({status:"User created successfully",status_code:200,user_id:newUser.id})
    }catch(err){
        console.log(err)
        res.status(500).json({error:"Internal server error"})
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: "Incorrect username/password provided. Please retry", status_code: 401 });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({ status:"login successful",status_code:200,user_id:user.id,access_token:token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

// const addPlace=async(req,res)=>{
//     try{
//         const {name,address,phone_no,website,open_time,close_time}=req.body
//         if(!name||!address||!phone_no||!open_time||!close_time){
//             return res.status(400).json({error:"Please fill all the fields"})
//         }
//         const place=await Place.findOne({where:{name}})
//         if(place){
//             return res.status(400).json({error:"Place already exists"})
//         }
//         const operational_hours={open_time,close_time}
//         const newPlace=await Place.create({name,address,phone_no,website,operational_hours})
//         res.status(200).json({status:`${name} added successfully`,status_code:200,place_id:newPlace.id})
//     }catch(err){
//         console.log(err)
//         res.status(500).json({error:"Internal server error"})
//     }
// }


const addPlace = async (req, res) => {
  try {
    const { name, address, phone_no, website, operational_hours } = req.body;

    if (!name || !address || !phone_no || !operational_hours.open_time || !operational_hours.close_time) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    const place = await Place.findOne({ where: { name } });

    if (place) {
      return res.status(400).json({ error: "Place already exists" });
    }

    const newPlace = await Place.create({
      name,
      address,
      phone_no,
      website,
      operational_hours
    });

    res.status(200).json({
      status: `${name} added successfully`,
      status_code: 200,
      place_id: newPlace.id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports={signup,login,addPlace}