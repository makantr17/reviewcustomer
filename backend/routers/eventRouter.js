import express from 'express'
import Event from '../models/eventModel'
import { isAuth } from '../util';

const router = express.Router();

router.get("/", async (req, res) =>{
    const event = await Event.find({});
    res.send(event);
});

router.post("/", async (req, res)=>{
    const event = await new Event({
    socialMedia: req.body.socialMedia,
    userId: req.body.userId,
    name: req.body.name,
    details: req.body.details,
    image: req.body.imagePath
    });
    const newEvent = await event.save();
    if (newEvent) {
       return res.status(201).send({massage: "New Event created", data: newEvent})
    }
    return res.status(500).send({message: "Error while creating event"});
});

router.put("/:id", async (req, res)=>{
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (event) {
        event.socialMedia = req.body.socialMedia; 
        event.userId= req.body.userId;
        event.name= req.body.name;
        event.details= req.body.details;
        event.image= req.body.imagePath;
        

        const updateEvent = await event.save();
        if (updateEvent) {
             return res.status(200).send({massage: "Event Updated", data: updateEvent})
        }
    }
    return res.status(500).send({message: "Error Updating the Event"});
});


router.post("/comment/:id", async (req, res)=>{
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (event) {
        event.commentEvent=  [...(event.commentEvent), req.body];
        const updateEvent = await event.save();
        if (updateEvent) {
             return res.status(200).send({massage: "Comment Successful", data: updateEvent})
        }
    }
})
router.post("/likes/:id", async (req, res)=>{
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (event) {
        event.likes= event.likes + req.body.likes;
        event.dislikes= event.dislikes + req.body.dislikes;
        const updateEvent = await event.save();
        if (updateEvent) {
             return res.status(200).send({massage: "Comment Successful"})
        }
    }
})

router.delete("/:id", async (req, res) =>{
    const deleteEvent = Event.findById(req.params.id);
    if (deleteEvent) {
        await deleteEvent.remove();
        res.send({message: "Event Deleted"});
    }else{
        res.send({message: "Error Deleting the Event"});
    }
});





export default router;