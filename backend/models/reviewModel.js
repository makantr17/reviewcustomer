import mongoose from 'mongoose'
const reviewSchema = new mongoose.Schema({
    id_:{type: mongoose.Schema.Types.ObjectId},
    date: {type: Date, default: Date.now()},
    name: {type: String, required: true},
    review: {type: String, required: true},
    category: {type: String, required: true},
    rating: {type: Number, required: true}
})

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;