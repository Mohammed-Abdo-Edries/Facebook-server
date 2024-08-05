const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs")
router.post("/register", async (req,res) => {
    const { firstname, lastname, email, password } = req.body
    try{ 
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // const newUser = new User({
        //     username: req.body.username,
        //     email: req.body.email,
        //     password: hashedPassword
        // });
        const user = await User.signup(firstname, lastname, email, password)
        res.status(200).json(user);
    } catch (err){
        res.status(500).json({err: err.message});
    }
});
router.post("/login", async(req,res) =>{
    const { email, password } = req.body
    try{
        const user = await User.login(email, password)
        // const user = await User.findOne({email:req.body.email});
        // !user && res.status(404).json("user not found")
        // const validPassword = await bcrypt.compare(req.body.password, user.password)
        // !validPassword && res.status(400).json("wrong password")
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({err: err.message});
    }
})
router.get("/getAllusers", async(req,res) =>{
    try{
        const allUsers = await User.find({});
        return res.status(200).json(allUsers);
    }catch(err){
        return res.status(400).json({err: err.message})
    }
})
module.exports = router;