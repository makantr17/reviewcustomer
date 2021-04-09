import express from 'express'
import User from '../models/userModel'
import { getToken, singupToken, serverLink, resetToken} from '../util';
import jwt from 'jsonwebtoken'
import config from '../config'


// var nodemailer = require('nodemailer');
var cors = require('cors');
// const creds = require('../configMail');

const router = express.Router();

// Transporter
// var transport = {
//     host: 'smtp.gmail.com', port: 587, auth: {user: creds.USER, pass: creds.PASS}
// }
// var transporter = nodemailer.createTransport(transport)
// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   }else {
//     console.log('Server is ready to take messages');
//   }
// });


// Email Sign-up
router.post('/sendActivationLink', async (req, res)=>{
    const signinupUser = await User.findOne({
        email: req.body.email
    });
    if(signinupUser){
        return res.status(400).send({message: "user with this email exists"})
    }
    // var content = `name: ${req.body.name} \n email: ${"kantemamady92@gmail.com"} \n message:
    // <h2>Sareti Activation Token</h2>
    // <p>Click to this link to activate your account, Token</p>
    // <a target="_" href="${serverLink()}/register/${singupToken({name: req.body.name, email: req.body.email, password: req.body.password})}">Activate your account</a>`

    // var mail = {
    //     from: "SARETI Shop",
    //     to: req.body.email,  // Change to email address that you want to receive messages on
    //     subject: 'Confirm the password',
    //     html: content
    // }
    // transporter.sendMail(mail, (err, data) => {
    //     if (err) {
    //         res.json({message: 'Failed to send message'})
    //     } else {
    //         res.json({message: 'Succeded sending email'})
    //     }
    // })
});


// Email Reset Password
router.post('/sendResetPassword', async (req, res)=>{
    const userInfo = await User.findOne({
        email: req.body.email
    });
    if(!userInfo){
        return res.status(400).send({message: email})
    }
    // var content = `name: ${userInfo.email} \n ID: ${userInfo._id} \n message:
    // <h2>Sareti Activation Token</h2>
    // <p>Click to this link to activate your account, Token</p>
    // <a target="_" href="${serverLink()}/resetPass/${resetToken({id: userInfo._id})}">Reset your account Password</a>`

    // var mail = {
    //     from: "SARETI Shop",
    //     to: req.body.email,  // Change to email address that you want to receive messages on
    //     subject: 'Confirm the password',
    //     html: content
    // }
    // transporter.sendMail(mail, (err, data) => {
    //     if (err) {
    //         res.json({message: 'Failed to send message'})
    //     } else {
    //         res.json({message: 'Succeded sending email'})
    //     }
    // })
});


router.post('/register', async (req, res) =>{
    const {token} = req.body;
    if (token) {
        jwt.verify(token, config.JWT_SECRET_REGISTER, (err, decode)=>{
            if (err) {
                return res.status(400).send({error: "invalid Token", token: token});
            }
            const {name, email, password} = decode;
            User.findOne({email}).exec((error, user) => {
                if (user) {
                    return res.status(400).send({error: "This email already exists"})
                }
                const newUser= new User({name, email, password});
                const savedUser = newUser.save();
                    if (savedUser) {
                        return res.status(200).send({message:"Successfuly Activated", data: newUser})
                    }else{
                        return res.status(400).send({error: "Failed To Save user Account"});
                    }
            });
            
        })
    }else{
        return res.json({error: "Something went Wrong"})
    }
})

// Signin
router.post('/signin', async (req, res)=>{
    const signinUser = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });
    if (signinUser) {
        res.send({
            _id: signinUser._id,
            email: signinUser.email,
            name: signinUser.name,
            isAdmin: signinUser.isAdmin,
            token: getToken(signinUser)
        });
    }else{
        res.status(404).send({message: "Wrong email or password"});
    }
})

router.delete('/signin', async (req, res)=>{
    const deleteUser = await User.find();
    if (deleteUser) {
        res.send({message: "successfully logout"
        });
    }else{
        res.status(404).send({message: "Couldn't delete"});
    }
})


router.put('/reset', async (req, res) =>{
    const token = req.body.token;
    if (token) {
        jwt.verify(token, config.JWT_SECRET_RESET, (err, decode)=>{
            if (err) {
                return res.status(400).send({error: "invalid Token", token: token});
            }
            const userId = decode._id;
            const _id = userId.id;
            User.findOne({_id}).exec((error, user) => {
                if (user){
                    user.password = req.body.password;
                    const userUpdate = user.save();
                    if (userUpdate) {
                        res.status(200).send({message: "User updated"});
                    }else{
                        res.status(400).send({error: "Error while Reseting User password"});
                    }
                }
                else{
                    res.status(400).send({error: "Error while Reseting User password"});
                }
            });
        })
    }else{
        res.status(400).send({error: "Error of sending Token"});
    }
});



// Update User
router.put('/register/:id', async (req, res)=>{
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});
    if (user) {
        user.name= req.body.name;
        user.email= req.body.email;
        user.country = req.body.country;
        user.profession = req.body.profession;
        user.address = req.body.address;
        user.city = req.body.city;
        user.image = req.body.image;
        user.phone = req.body.phone;

        const userUpdate = user.save();
        if (userUpdate) {
            res.status(200).send({message: "User updated", data: userUpdate});
        }
    }
    res.status(500).send({message: "Error Updating the indentification"})
})

// update user Access
router.put('/access/:id', async (req, res)=>{
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});
    if (user) {
        user.accessibility.publishProduct= req.body.accessibility.publishProduct;
        user.accessibility.createProduct= req.body.accessibility.createAccessProduct;
        user.accessibility.deleteProduct = req.body.accessibility.deleteProduct;
        user.accessibility.editProduct = req.body.accessibility.editProduct;
        user.accessibility.publishEvent = req.body.accessibility.publishEvent;
        user.accessibility.deleteEvent = req.body.accessibility.deleteEvent;
        user.accessibility.editEvent = req.body.accessibility.editEvent;
        user.accessibility.createEvent = req.body.accessibility.createEvent;
        user.accessibility.deleteOrder = req.body.accessibility.deleteOrder;
        user.accessibility.editOrder = req.body.accessibility.editOrder;
        // user.accessibility = req.body.accessibility;

        const userUpdate =await user.save();
        if (userUpdate) {
            res.status(200).send({message: "User updated", data: userUpdate});
        }
    }
})
  

// Create new User
// router.post("/register", (req, res)=>{
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         country: req.body.country,
//         profession: req.body.profession, 
//         address: req.body.address,
//         city: req.body.city, 
//         image: req.body.image, 
//         phone: req.body.phone
//     });
//     const newUser = user.save();
//     if (newUser) {
//         res.send({
//             _id: newUser._id,
//             name: newUser.name,
//             email: newUser.email,
//             isAdmin: newUser.isAdmin,
//             country: newUser.country,
//             profession: newUser.profession, 
//             address: newUser.address,
//             city: newUser.city, 
//             image: newUser.image, 
//             phone: newUser.phone,
//             token: getToken(newUser)
//         });
        
//     }else{
//         res.status(401).send({msg: 'Invalid User data'})
//     }
// });


// get user Info
router.get("/register/:id", async(req, res)=>{
    const user= await User.findById({_id: req.params.id});
    if(user){
        res.send(user)
    }else{
        res.status(404).send({message: "failed loading Fetching data"})
    }
})

// get all user infos
router.get("/register", async(req, res)=>{
    const users= await User.find();
    if (users) {
        res.send(users)
    }else{
        res.status(404).send({message: "failed loading Fetching data"})
    }
})

export default router;

