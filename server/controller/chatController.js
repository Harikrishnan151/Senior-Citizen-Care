const chats=require('../model/compliantSchema')

//send message
exports.sendMessage = async (req, res) => {
    console.log('inside chat send');

    const { senderId, senderName, receiverId, message } = req.body;
    try {
        const token = req.headers.authorization;
        console.log(token);
            if (!token) {
              return res.status(401).json({ message: "Unauthorized: No token provided" });
            }
        jwt.verify(token, "superkey2024", async (err, decoded) => {
            if (err) {
              return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
        const newMessage = new chats({ senderId, senderName, receiverId, message });
        await newMessage.save();
        res.status(200).json({ message: 'Message sent successfully', newMessage });
        })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

//get message
exports.getMessages = async (req, res) => {

    console.log('inside chat get');

    const { userId1, userId2 } = req.params;
    try {
        const messages = await chats.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ timestamp: 1 }); // Sort by timestamp ascending
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get messages' });
    }
};
