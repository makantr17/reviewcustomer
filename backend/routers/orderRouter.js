import express from 'express'
import Order from '../models/orderModel'
// import { isAuth } from '../util';

var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('../configMail');

// import mongoose from 'mongoose'
// import { getToken } from '../util';
const router = express.Router();

router.get("/", async (req, res) =>{
    const orders = await Order.find({});
    res.send(orders);
});

router.get("/:id", async (req, res) =>{
    const orders = await Order.find({userId: req.params.id});
    if (orders) {
        res.send(orders)
    }else{
        res.status(404).send({message:"Orders not found"})
    }
});


router.get("/category/:id", async (req, res) =>{
  // const statisticInfo = await Order.cartItems.find({productId: req.params.id});
  const statisticInfo = await Order.aggregate([{$unwind: "$cartItems"}, {$match:{"cartItems.productId" : req.params.id}}] )

  if (statisticInfo) {
    res.send(statisticInfo);
  }else{
      res.status(404).send({message:"No data found"});
  }
})



router.post("/", async (req, res)=>{
    const order = await new Order({
    payment:{
        paymentMethod: req.body.payment.paymentMethod
    },
    
    cartItems: req.body.cartItems,
    userId: req.body.userId,
    shipping: {
        address:req.body.shipping.address,
        city:req.body.shipping.city,
        postalCode:req.body.shipping.postalCode,
        country:req.body.shipping.country
    }
        
    });
    const newOrder = await order.save();
    if (newOrder) {
       return res.status(201).send({massage: "New Order created", data: newOrder})
    }
    return res.status(500).send({message: "Error while creating order"});
});


router.delete("/:id", async (req, res) =>{
    const deleteOrder = Order.findById(req.params.id);
    if (deleteOrder) {
        await deleteOrder.deleteOne();
        res.send({message: "Order Deleted"});
    }else{
        res.send({message: "Error Deleting the Order"});
    }
});



router.put("/:id", async (req, res) =>{
  const order = await Order.findById(req.params.id);
  if (order) {
     order.paidTime =  req.body.paidTime;
     order.paid =  req.body.paid;

     const updatePayment = await order.save();
    if (updatePayment) {
        res.status(200).send({massage: "Payment confirmation Successful", data: updatePayment})
    }
  }
  return res.send({message: "Failed of saving Product"});
 
});



// start here
var transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});


router.post('/send', async (req, res, next) => {
    const orderId = req.body.orderId;
    const orders = await Order.findOne({_id: orderId});

    const email = req.body.email;
    const name = req.body.name;

    
    
    if (orders) {
      // var addProductType = orders.cartItems.map(printAll => 
      //   `Product Name: ${printAll.productName} Quantity Ordered : ${printAll.qty} \n`
      // )
      var content = `name: ${name} \n email: ${"kantemamady92@gmail.com"} \n message:
         ${"Thanks for being one of our best customers of the year, BookedDate: " + orders.date} }`
    }
    
  
    var mail = {
      from: "SARETI Shop",
      to: email,  // Change to email address that you want to receive messages on
      subject: 'Thanks for buying our product',
      text: content
    }
  
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({message: 'Failed to send message'})
      } else {
        res.json({message: 'Succeded sending email'})
      }
    })
  })





export default router;