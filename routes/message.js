import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import express from "express";
import {getReceiverSocketId,io} from "../socket.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();
 
router.post("/send/:id", protectRoute, async (req, res) => {
	try {
		const { message } = req.body;
		// console.log(message)
		const { id: receiverId } = req.params;
		// console.log(receiverId)
		const senderId = req.user._id;
		// console.log(senderId)

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		await conversation.save();
		await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error:" });
	}
});

router.get("/getAllMessages", async(req,res) => {
	try{
		const allMessages = await Message.find({});
        return res.status(200).json(allMessages);
	} catch(error){
		console.log(error)
		res.status(500).json(error)
	}
})
router.get("/:id", async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}); 
// module.exports = router
export default router;
