import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    id_:{type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, dropDups: true},
    password: {type: String, required: true},
    country: {type: String,  default: ''},
    profession: {type: String,  default: ''},
    address: {type: String, default: ''},
    city: {type: String, default: ''},
    image: {type: String,  default: ''},
    phone: {type: String,  default: ''},
    isAdmin: {type: Boolean, default: false},
    resetLink: {data: String, default: ''},
    accessibility:{
        publishProduct: {type: Boolean, default: false},
        createProduct: {type: Boolean, default: false},
        deleteProduct: {type: Boolean, default: false},
        editProduct: {type: Boolean, default: false},

        publishEvent: {type: Boolean, default: false},
        deleteEvent: {type: Boolean, default: false},
        editEvent: {type: Boolean, default: false},
        createEvent: {type: Boolean, default: false},

        deleteOrder: {type: Boolean, default: false},
        editOrder: {type: Boolean, default: false},

        notification: {type: Boolean, default: false},
        confirmDelivering: {type: Boolean, default: false},
        deleteNotification: {type: Boolean, default: false}
    }
});

const userModel = mongoose.model("User", userSchema);

export default userModel;