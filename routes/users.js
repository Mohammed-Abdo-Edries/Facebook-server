import User from "../models/User.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
const router = express.Router();

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET)
}

router.post("/register", async (req,res) => {
    const { firstname, lastname, email, password } = req.body
    try{ 
        const user = await User.signup(firstname, lastname, email, password)
        const token = createToken(user._id)
        const isAdmin = user.isAdmin
        res.status(200).json({ firstname, lastname, isAdmin, email, token })
    } catch (err){
        res.status(500).json({err: err.message});
    }
});
router.post("/login", async(req,res) =>{
    const { email, password } = req.body
    try{
        const user = await User.login(email, password)
        const token = createToken(user._id)
        const firstname = user.firstname
        const lastname = user.lastname
        const isAdmin = user.isAdmin
        res.status(200).json({ firstname, lastname, isAdmin, email, token })
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
            return res.status(500).json({err: err.message});
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body});
            res.status(200).json("account has been updated")   
        } catch (err){
            return res.status(500).json({err: err.message});
        }
    } 
    } else { 
        return res.status(403).json("You can update only your account!");
    }
}) 
router.delete("/:id", async(req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
    if (req.body.password){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account has been deleted")   
        } catch (err){
            return res.status(500).json({err: err.message});
        }
    } 
    } else { 
        return res.status(403).json("You can delete only your account!");
    }
}) 
router.get("/:id", async(req,res) =>{
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt,...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        res.status(500).json({err: err.message})
    }
})
router.put("/:id/follow", async(req,res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("you dont follow this user")
            }
        }catch(err){
            res.status(500).json({err: err.message})
        }
    }else{
        res.status(403).json("you cant follow yourself")
    }
})
router.put("/:id/unfollow", async(req,res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json("user has been unfollowed")
            }
        }catch(err){
            res.status(500).json({err: err.message})
        }
    }else{
        res.status(403).json("you cant unfollow yourself")
    }
})

export default router;
