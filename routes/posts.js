import express from "express";
import Post from "../models/Post.js";
const router = express.Router();

router.post("/", async(req,res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost._doc);
    }catch(err){
        res.status(500).json({err: err.message})
    }
})
router.put("/:id", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("the post has been updated")
        }else{
            res.status(403).json("you can update only your post")
        }
    }catch(err){
        res.status(500).json({err: err.message})
    }
})
router.delete("/:id", async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne({$set:req.body});
            res.status(200).json("the post has been deleted")
        }else{
            res.status(403).json("you can delete only your post")
        }
    }catch(err){
        res.status(500).json({err: err.message})
    }
})
router.put("/:id/like", async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("The post has been liked");
        } else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("The post has been disliked");
        }
    } catch(err){
        res.status(500).json({err: err.message});
    }
})
router.get("/:id", async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        // const {password,updatedAt,...other} = user._doc
        res.status(200).json(post);
    } catch(err){
        res.status(500).json({err: err.message})
    }
})
router.get("/timeline/all", async(req,res) =>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
               return Post.find({userId: friendId});
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    }catch(err){
        res.status(500).json({err: err.message});
    }
})
export default router;
// module.exports = router
