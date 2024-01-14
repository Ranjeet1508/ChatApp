const {Router} = require('express');
const messageRouter = Router();
const bcrypt = require("bcrypt");
const{messageModel} = require('../Models/messageModel')

messageRouter.post('/getAllMessage', async(req,res) => {
try {
    const{from, to} = req.body;
    const message = await messageModel.find({
        users: {
            $all: [from, to]
        }
    })
    .sort({updatedAt: 1})
    const projectMessages = message.map((msg, idx) => {
        return {
            fromSelf: msg.sender.toString()===from,
            message: msg.message.text
        }
    })
    res.json(projectMessages);
} catch (error) {
    res.send({msg: "Error", error})
}
})


messageRouter.post('/addMessage', async(req,res) => {
    try {
        const {from , to, message} = req.body;
        const newMessage = new messageModel({
            message: {text: message},
            users:[from, to],
            sender: from,
        })
        await newMessage.save();
        res.send({msg: "message added successfully", newMessage})
    } catch (error) {
        res.send({msg: "failed to add message", newMessage})
    }
})



module.exports = {
    messageRouter
}