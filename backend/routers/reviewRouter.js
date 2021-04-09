import express from 'express'
import Review from '../models/reviewModel'
import File from '../models/file'
const fs = require('fs')
// import { isAuth } from '../util';
// const path = require('path');
const multer = require('multer');

const router = express.Router();



// routers goes here
router.post("/",  async (req, res)=>{
    const review_deck = new Review({
        name: req.body.name, 
        review: req.body.review,
        category: req.body.category, 
        rating: req.body.rating,
    });
    const newReview = await review_deck.save();
    if (newReview) {
        return res.status(201).send({message: "Your review successfully Saved", data: newReview})
    }else{
        return res.status(500).send({message: "Failed to save review"})
    }
})



router.get("/", async (req, res) =>{
    const reviews = await Review.find({});
    res.send(reviews);
});


router.delete("/:id", async (req, res) =>{
    const deleteReview = Review.findById(req.params.id);
    if (deleteReview) {
        await deleteReview.remove();
        res.send({message: "Review succesfully Deleted"});
    }else{
        res.send({message: "Error Deleting the Review"});
    }
});


router.get("/:id", async (req, res) =>{
    const reviews = await Review.find({category: req.params.id});
    if (reviews) {
        res.send([reviews])
    }else{
        res.status(404).send({message:"Review not found"})
    }
});



export default router;






