import User from "../models/User.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
const router = express.Router();

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET)
}

router.post("/login", async(req,res) =>{
    const { email, password } = req.body
    console.log(email,password);
    try{
        const user = await User.login(email, password)
        console.log(user);
        const token = createToken(user._id)
        const firstname = user.firstname
        const lastname = user.lastname
        const isAdmin = user.isAdmin
        console.log(user._id);
        res.status(200).json({ firstname, lastname, isAdmin, email, token,userId: user._id,friends: user.friends })
    } catch (err) {
        console.log(email,password );
        console.log(err.message);
        res.status(400).json({err: err.message});
    }
})
router.post("/register", async (req,res) => {
    const { firstname, lastname, email, password } = req.body
    try{ 
        const user = await User.signup(firstname, lastname, email, password)
        const token = createToken(user._id)
        const isAdmin = user.isAdmin
        const userId = user._id
        res.status(200).json({ firstname, lastname, isAdmin, email, token, userId: user._id })
    } catch (err){
        res.status(400).json({err: err.message});
    }
});
router.get("/getAllusers", async(req,res) =>{
    try{
        const allUsers = await User.find({});
        return res.status(200).json(allUsers);
    }catch(err){
        return res.status(400).json({err: err.message})
    }
})
router.delete('/deleteAllUsers', async (req, res) => {
    try {
        const users = await User.deleteMany({})
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error.message })
    }
})


router.put("/:id", async(req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
    if (req.body.password){
        try{
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
            return res.status(400).json({err: err.message});
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body});
            res.status(200).json("account has been updated")   
        } catch (err){
            return res.status(400).json({err: err.message});
        }
    } 
    } else { 
        return res.status(400).json("You can update only your account!");
    }
}) 
router.delete("/:id", async(req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
    if (req.body.password){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account has been deleted")   
        } catch (err){
            return res.status(400).json({err: err.message});
        }
    } 
    } else { 
        return res.status(400).json("You can delete only your account!");
    }
}) 
router.get("/:id", async(req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt,...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        res.status(400).json({err: err.message})
    }
})
router.put("/:id/follow", async(req,res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.friends.includes(req.body.userId)){
                await user.updateOne({$push:{friends:req.body.userId}});
                await currentUser.updateOne({$push:{friends:req.params.id}});
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("you dont follow this user")
            }
        }catch(err){
            res.status(400).json({err: err.message})
        }
    }else{
        res.status(400).json("you cant follow yourself")
    }
})
router.put("/:id/unfollow", async(req,res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.friends.includes(req.body.userId)){
                await user.updateOne({$pull:{friends:req.body.userId}});
                await currentUser.updateOne({$pull:{friends:req.params.id}});
                res.status(200).json("user has been unfollowed")
            } 
        }catch(err){
            res.status(400).json({err: err.message})
        }
    }else{
        res.status(400).json("you cant unfollow yourself")
    }
})
router.get("/:id/friends", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    if (!user.friends || user.friends.length === 0) {
        return res.status(200).json([]);
    }
    const friendDetails = await Promise.all(
         user.friends.map(async (friendId) => {
             const friend = await User.findById(friendId).select(
                 "firstname lastname email userId"
                );
                return friend;
            })
        );
        console.log("Populated friends:", friendDetails);
    res.status(200).json(friendDetails);
  } catch (err) {
    console.error("Error fetching friends:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
// module.exports = router
