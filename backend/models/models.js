import mongoose from 'mongoose'

const modelSchema = new mongoose.Schema({
    id_:{type: mongoose.Schema.Types.ObjectId},
    date: {type: Date, default: Date.now()},
    companyId: {type: String, default: ''},
    models:{
        modelType: {type: String,  default: ''},
        modelName: {type: String,  default: ''},
        modelSize:{type: String,  default: ''},
        description:{type: String,  default: ''}
    }
    
});

const modelofModel = mongoose.model("Model", modelSchema);

export default modelofModel;