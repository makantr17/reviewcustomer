import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
    id_:{type: mongoose.Schema.Types.ObjectId},
    date: {type: Date, default: Date.now()},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, dropDups: true},
    password: {type: String, required: true},
    country: {type: String,  default: ''},
    city: {type: String,  default: ''},
    address: {type: String, default: ''},
    about: {type: String,  default: ''},
    logo: {type: String,  default: ''},
    phone: {type: String,  default: ''},
    userId: {type: String, required: true},
    isAdmin: {type: Boolean, default: true},
    resetLink: {data: String, default: ''},
    business:{
        corValues: {type: String, default: ''},
        services: {type: String, default: ''},
        category: {type: String, default: ''},
        type: {type: String, default: ''},
        target: {type: String, default: ''},
        objective: {type: String, default: ''},
        status: {type: String, default: ''},
        funding: {type: String, default: ''},
        // growth: {type: String, default: ''},
        // logistics: {type: String, default: ''},
        employees: {type: Number, default: 0}
    },
    data:{
        website: {type: String, default: ''},
        apiBackend: {type: String, default: ''},
        dataType: {type: String, default: ''},
        surveys: {type: Boolean, default: false},
        comment: {type: String, default: ''},
        api: {type: String, default: ''},
        dataStorage: {type: String, default: ''},
        backend: {type: String, default: ''}
    },
    account: {
        accountName: {type: String, default: ''},
        balance: {type: String, default: '0'},
        accountNumber:{type: String, default: ''},
        bankName: {type: String, default: ''}
    }
});

const companyModel = mongoose.model("Company", companySchema);

export default companyModel;