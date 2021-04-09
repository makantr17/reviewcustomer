import mongoose from 'mongoose'

const datasetSchema = new mongoose.Schema({
    id_:{type: mongoose.Schema.Types.ObjectId},
    date: {type: Date, default: Date.now()},
    companyId: {type: String, default: ''},
    datasets:{
        fileName: {type: String,  default: ''},
        fileSize: {type: String,  default: ''},
        filepath: {type: String,  default: ''}
    },
});

const datasetModel = mongoose.model("Dataset", datasetSchema);

export default datasetModel;