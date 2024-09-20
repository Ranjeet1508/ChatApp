const {Router} = require('express');
const userRouter = Router();
const bcrypt = require("bcrypt");
const{userModel} = require('../Models/myUserModel')

userRouter.post("/register", async(req, res) => {
    const {name, email, password} = req.body;
    const user = await userModel.findOne({email});
    if(user){
        return res.json({msg: "User already exist", status: false})
    }
    else{
        bcrypt.hash(password,4, async function(err, hash){
            if(err){
                return res.json("Something went wrong");
            }
            let newUser = await userModel({
                name,
                email,
                password:hash
            })
            await newUser.save();
        });
        res.send({msg:"Signup Successfull", status: true} )
    }
})


userRouter.post('/login', async(req,res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.send({msg: "user does not exist, Signup first!", status:false})
    }
    else{
        const hashedPassword = user.password;
        bcrypt.compare(password, hashedPassword, async function(err, result) {
            if(err){
                return res.send({msg: "Something went wrong", status: false})
            }
            if(!result){
                return res.send({msg: "Wrong Credentials", status: false})
            }
            else{
                return res.send({user, status: true})
            }
        });
    }    
})

userRouter.post('/setAvatar/:id', async(req,res) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await userModel.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    } catch (error) {
        console.log(error)
    }
})

userRouter.get("/allusers/:id", async(req, res) => {
    try {
        const users = await userModel.find({_id:{$ne:req.params.id}}).select([
            "email", "name", "_id"
        ])
        console.log(users);
        return res.send(users);
    } catch (error) {
        console.log(error)
    }
})


module.exports = {
    userRouter
}