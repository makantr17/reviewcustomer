import express from 'express'
import Company from '../models/companyModel'
import { getToken, getCompToken, compSingupToken, serverLink, resetToken} from '../util';
import jwt from 'jsonwebtoken'
import config from '../config'


var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('../configMail');

const router = express.Router();

// Transporter
var transport = {
    host: 'smtp.gmail.com', port: 587, auth: {user: creds.USER, pass: creds.PASS}
}
var transporter = nodemailer.createTransport(transport)
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  }else {
    console.log('Server is ready to take messages');
  }
});


// Email Sign-up
router.post('/companyActivationLink', async (req, res)=>{
    const signinupUser = await Company.findOne({ 
        email: req.body.email,
    });
    if(signinupUser){
        return res.status(400).send({message: "user with this email exists"})
    }
    var content = `name: ${req.body.name} \n email: ${"kantemamady92@gmail.com"} \n message:
    <h2>Sareti Activation Token</h2>
    <p>Click to this link to activate your account, Token</p>
    <a target="_" href="${serverLink()}/companyRegistrer/${compSingupToken({userId: req.body.userId, name: req.body.name, email: req.body.email, password: req.body.password,
        })}">Activate your account</a>`
        // target: req.body.target, address: req.body.address, type: req.body.type, description: req.body.description, 
        // city: req.body.city, country: req.body.country, phone: req.body.phone, category: req.body.category,
        // status: req.body.status, objective: req.body.objective
    var mail = {
        from: "SARETI Shop",
        to: req.body.email,  // Change to email address that you want to receive messages on
        subject: 'Confirm the company accounrt',
        html: content
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({message: 'Failed to send message'})
        } else {
            res.json({message: 'Succeded sending email'})
        }
    })
});


// Email Reset Password
router.post('/compSendResetPassword', async (req, res)=>{
    const compInfo = await Company.findOne({
        email: req.body.email
    });
    if(!compInfo){
        return res.status(400).send({message: email})
    }
    var content = `name: ${compInfo.email} \n ID: ${compInfo._id} \n message:
    <h2>Sareti Activation Token</h2>
    <p>Click to this link to activate your account, Token</p>
    <a target="_" href="${serverLink()}/resetPass/${resetToken({id: compInfo._id})}">Reset your account Password</a>`

    var mail = {
        from: "SARETI Shop",
        to: req.body.email,  // Change to email address that you want to receive messages on
        subject: 'Confirm the company password',
        html: content
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({message: 'Failed to send message'})
        } else {
            res.json({message: 'Succeded sending email'})
        }
    })
});


router.post('/registerCompany', async (req, res) =>{
    const {token} = req.body;
    if (token) {
        jwt.verify(token, config.JWT_COMPANY_REGISTER, (err, decode)=>{
            if (err) {
                return res.status(400).send({error: "invalid Token", token: token});
            }
            const {userId, name, email, password} = decode;
            Company.findOne({userId, name, email}).exec((error, user) => {
                if (user) {
                    return res.status(400).send({error: "This email already exists"})
                }
                const newUser= new Company({userId, name, email, password});
                // , target, address, type, description, 
                //     city, country, phone, category, status, objective
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
router.post('/signinComp', async (req, res)=>{
    const signinUser = await Company.findOne({
        email: req.body.email,
        password: req.body.password
    });
    if (signinUser) {
        res.send({
            _id: signinUser._id,
            email: signinUser.email,
            name: signinUser.name,
            isAdmin: signinUser.isAdmin,
            token: getCompToken(signinUser)
        });
    }else{
        res.status(404).send({message: "Wrong email or password"});
    }
})

router.delete('/signin', async (req, res)=>{
    const deleteUser = await Company.find();
    if (deleteUser) {
        res.send({message: "successfully logout"
        });
    }else{
        res.status(404).send({message: "Couldn't delete"});
    }
})


// router.put('/reset', async (req, res) =>{
//     const token = req.body.token;
//     if (token) {
//         jwt.verify(token, config.JWT_SECRET_RESET, (err, decode)=>{
//             if (err) {
//                 return res.status(400).send({error: "invalid Token", token: token});
//             }
//             const userId = decode._id;
//             const _id = userId.id;
//             User.findOne({_id}).exec((error, user) => {
//                 if (user){
//                     user.password = req.body.password;
//                     const userUpdate = user.save();
//                     if (userUpdate) {
//                         res.status(200).send({message: "User updated"});
//                     }else{
//                         res.status(400).send({error: "Error while Reseting User password"});
//                     }
//                 }
//                 else{
//                     res.status(400).send({error: "Error while Reseting User password"});
//                 }
//             });
//         })
//     }else{
//         res.status(400).send({error: "Error of sending Token"});
//     }
// });



// Update User
router.put('/registerCompanyEntry/:id', async (req, res)=>{
    const userId = req.params.id;
    const user = await Company.findOne({userId: userId});
    if (user) {
        user.data.website = req.body.website;
        user.data.apiBackend = req.body.apiBackend;
        user.data.dataType = req.body.typeData;
        user.data.comment = req.body.comment;
        user.data.api = req.body.api;
        user.data.dataStorage = req.body.dataStorage;
        user.data.backend = req.body.backend;
        


        const userUpdate = user.save();
        if (userUpdate) {
            res.status(200).send({message: "User updated", data: userUpdate});
        }
    }
    res.status(500).send({message: "Error Updating the indentification"})
})



// Update User
router.put('/registerCompany/:id', async (req, res)=>{
    const userId = req.params.id;
    const user = await Company.findOne({userId: userId});
    if (user) {
            user.country = req.body.country;
            user.address = req.body.address;
            user.city = req.body.city;
            user.phone = req.body.phone;
            user.business.target = req.body.target;
            user.business.type = req.body.type;
            user.business.category = req.body.category;
            user.about = req.body.description;
            user.business.objective = req.body.objective;
            user.business.status = req.body.status;
            user.business.employees = req.body.employees;
            user.business.funding = req.body.funding;
            user.business.services = req.body.services;
            user.business.corValues = req.body.corValues;

        const userUpdate = user.save();
        if (userUpdate) {
            res.status(200).send({message: "User updated", data: userUpdate});
        }
    }
    res.status(500).send({message: "Error Updating the indentification"})
})

// update user Access
// router.put('/access/:id', async (req, res)=>{
//     const userId = req.params.id;
//     const user = await User.findOne({_id: userId});
//     if (user) {
//         user.accessibility.publishProduct= req.body.accessibility.publishProduct;
//         user.accessibility.createProduct= req.body.accessibility.createAccessProduct;
//         user.accessibility.deleteProduct = req.body.accessibility.deleteProduct;
//         user.accessibility.editProduct = req.body.accessibility.editProduct;
//         user.accessibility.publishEvent = req.body.accessibility.publishEvent;
//         user.accessibility.deleteEvent = req.body.accessibility.deleteEvent;
//         user.accessibility.editEvent = req.body.accessibility.editEvent;
//         user.accessibility.createEvent = req.body.accessibility.createEvent;
//         user.accessibility.deleteOrder = req.body.accessibility.deleteOrder;
//         user.accessibility.editOrder = req.body.accessibility.editOrder;
//         // user.accessibility = req.body.accessibility;

//         const userUpdate =await user.save();
//         if (userUpdate) {
//             res.status(200).send({message: "User updated", data: userUpdate});
//         }
//     }
// })
  



// get user Info
router.get("/registerCompany/:id", async(req, res)=>{
    const user= await Company.findOne({userId: req.params.id});
    if(user){
        res.send(user)
    }else{
        res.status(404).send({message: "failed loading Fetching data"})
    }
})

// get all user infos
router.get("/registerCompany", async(req, res)=>{
    const users= await Company.find();
    if (users) {
        res.send(users)
    }else{
        res.status(404).send({message: "failed loading Fetching data"})
    }
})

// get all user infos
// router.get("/companyInfo", async(req, res)=>{
//     const users= await Company.findOne({
//         email: req.params.email
//     });
//     if (users) {
//         res.send(users)
//     }else{
//         res.status(404).send({message: "failed loading Fetching data"})
//     }
// })

export default router;

