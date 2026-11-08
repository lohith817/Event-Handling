import {Router} from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
const router=Router();
const validId=id=>mongoose.isValidObjectId(id);
router.get("/",async(req,res,next)=>{try{
 const filter={}; if(req.query.category) filter.category=req.query.category;
 if(req.query.upcoming==="true") filter.date={$gte:new Date()};
 res.json(await Event.find(filter).sort({date:1}));
}catch(e){next(e)}});
router.get("/:id",async(req,res,next)=>{try{
 if(!validId(req.params.id)) return res.status(400).json({message:"Invalid event id"});
 const event=await Event.findById(req.params.id); if(!event)return res.status(404).json({message:"Event not found"}); res.json(event);
}catch(e){next(e)}});
router.post("/",async(req,res,next)=>{try{
 const data={...req.body,totalSeats:Number(req.body.totalSeats)};
 const event=await Event.create(data);res.status(201).json(event);
}catch(e){next(e)}});
router.put("/:id",async(req,res,next)=>{try{
 if(!validId(req.params.id))return res.status(400).json({message:"Invalid event id"});
 const event=await Event.findById(req.params.id);if(!event)return res.status(404).json({message:"Event not found"});
 const updates={...req.body};delete updates.registeredCount;
 if(updates.totalSeats!==undefined && Number(updates.totalSeats)<event.registeredCount)return res.status(400).json({message:"Total seats cannot be below current registrations"});
 Object.assign(event,updates);await event.save();res.json(event);
}catch(e){next(e)}});
router.delete("/:id",async(req,res,next)=>{try{
 if(!validId(req.params.id))return res.status(400).json({message:"Invalid event id"});
 const event=await Event.findByIdAndDelete(req.params.id);if(!event)return res.status(404).json({message:"Event not found"});
 await Registration.deleteMany({eventId:event._id});res.json({message:"Event and registrations deleted"});
}catch(e){next(e)}});
export default router;
