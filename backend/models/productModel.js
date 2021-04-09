import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now()},
    rating: {type: String, required: true, default: "0"},
    numReviews: {type: String, required: true, default: "0"},
    isPromo: {type:String, default: false},
    promotion: {type: String, default:''},
    startTime: {type: String, default:''},
    deadline: {type: String, default:''},
    accessAllowedProduct:{
        delete: {type: Boolean, default: false},
        edit: {type: Boolean, default: false},
        publish: {type: Boolean, default: false},
    },
    productCategory: {
        name: {type: String, required: true},
        category: {type: String, required: true},
        image: {type: String, required: true},
        price: {type: String, required: true},
        brand: {type: String, required: true},
        description: {type: String, required: true},
        reduction: {type: String, required: true},
    },
    productTypes: [
        {
            type: {type: String, required: true},
            image: {type: String, required: true},
            size: {type: String, required: true},
            priceByKilo: {type: String, default: 0, required: true},
            priceByPackage: {type: String, default: 0, required: true},
            countKiloInStock: {type: String, default: 0, required: true},
            countPackageInStock: {type: String, default: 0, required: true},
            priceByUnity: {type: String, default: 0, required: true},
            countUnityInStock: {type: String, default: 0, required: true},
            rouleau: {type: String, default: 0, required: true},
            countRouleau: {type: String, default: 0},
            color:{type: String, default: '', required: true},
            details: {type: String, required: true},
            reductionOn: {type: String, required: true}
        }
    ]
});


productSchema.path('productTypes').validate(function (value) {
    console.log(value.length)
    if (value.length > 10) {
      throw new Error("Assigned person's size can't be greater than 10!");
    }
  });

const productModel = mongoose.model("Product", productSchema);

export default productModel;