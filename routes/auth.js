const router = require("express").Router();
const User = require("../models/User")
router.post("/register", async (req,res) => {
    const { firstname, lastname, email, password } = req.body
    try{ 
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