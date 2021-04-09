import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    id_:{type: mongoose.Schema.Types.ObjectId},
    postedDate: {type: Date, default: Date.now()},
    expiredDate: {type: Date, default: '2020-09-21'},
    name: {type: String, required: true},
    details: {type: String, required: true},
    passed: {type: Boolean, default:false, required: true},
    userId: {type: String, required: true},
    image: {type: String, required: true},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    socialMedia: [],
    commentEvent: [
       {
          date: {type: Date, default: Date.now()},
          id: {type: mongoose.Schema.Types.ObjectId},
          userId: {type: String},
          childId: {type: String, default: 'Parent'},
          comment: {type: String},
          parentName: {type: String},
          nickName: {type:String},
       }
    ]
});

eventSchema.path('socialMedia').validate(function (value) {
    console.log(value.length)
    if (value.length > 10) {
      throw new Error("Assigned person's size can't be greater than 10!");
    }
});

eventSchema.path('commentEvent').validate(function (value) {
  console.log(value.length)
  if (value.length > 300) {
    throw new Error("Assigned person's size can't be greater than 10!");
  }
});

const eventModel = mongoose.model("Event", eventSchema);
export default eventModel;