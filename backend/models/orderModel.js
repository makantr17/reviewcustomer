import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    id_:{type: mongoose.Schema.Types.ObjectId},
    date: {type: Date, default: new Date()},
    paid: {type: Boolean, default:false, required: true},
    delivered: {type: Boolean, default:false, required: true},
    paidTime:{type: Date},
    
    payment: {
        paymentMethod: {type: String, required: true}
    },
    userId: {type: String, required: true},
    cartItems: [
        {
            productId: {type: String, required: true},
            productName: {type: String, required: true},
            size: {type: String, required: true},
            IdType: {type: String, required: true},
            Time: {type: String, required: true},
            paymentBy: {type: String, required: true},
            image: {type: String, required: true},
            typeName: {type: String, required: true},
            qty: {type: String, required: true},
            price: {type: String, required: true},
            countInStock: {type: String, required: true}
        }
    ],
    
    shipping: {
        address:{type: String, required: true},
        city:{type: String, required: true},
        postalCode:{type: String, required: true},
        country:{type: String, required: true}
    },
 
});

orderSchema.path('cartItems').validate(function (value) {
    console.log(value.length)
    if (value.length > 10) {
      throw new Error("Assigned person's size can't be greater than 10!");
    }
  });

const orderModel = mongoose.model("Order", orderSchema);


export default orderModel;