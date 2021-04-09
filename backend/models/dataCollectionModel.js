import mongoose from 'mongoose'
const dataCollectionSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now()},
    startTime: {type: String, default:''},
    deadline: {type: String, default:''},
    dataStatus:{
        anlysed: {type: Boolean, default: false},
        preprocessed: {type: Boolean, default: false},
        visualized: {type: Boolean, default: false},
    },
    dataCategory: {
        name: {type: String, required: true},
        category: {type: String, required: true},
        size: {type: String, required: true},
        format: {type: String, required: true},
        description: {type: String, required: true}
    }
    // productTypes: [
    //     {
    //         type: {type: String, required: true},
    //         image: {type: String, required: true},
    //         size: {type: String, required: true},
    //         priceByKilo: {type: String, default: 0, required: true},
    //         priceByPackage: {type: String, default: 0, required: true},
    //         countKiloInStock: {type: String, default: 0, required: true},
    //         countPackageInStock: {type: String, default: 0, required: true},
    //         priceByUnity: {type: String, default: 0, required: true},
    //         countUnityInStock: {type: String, default: 0, required: true},
    //         rouleau: {type: String, default: 0, required: true},
    //         countRouleau: {type: String, default: 0},
    //         color:{type: String, default: '', required: true},
    //         details: {type: String, required: true},
    //         reductionOn: {type: String, required: true}
    //     }
    // ]
});


// dataCollectionSchema.path('productTypes').validate(function (value) {
//     console.log(value.length)
//     if (value.length > 10) {
//       throw new Error("Assigned person's size can't be greater than 10!");
//     }
//   });

const dataCollectionModel = mongoose.model("Collection", dataCollectionSchema);

export default dataCollectionModel;