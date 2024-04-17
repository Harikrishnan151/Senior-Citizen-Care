const chats=require('../model/compliantSchema')


exports.sendMessage = async (req, res) => {
    console.log('inside chat send');

    const { senderId, senderName, receiverId, message } = req.body;
    try {
        const newMessage = new chats({ senderId, senderName, receiverId, message });
        await newMessage.save();
        res.status(200).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};


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
