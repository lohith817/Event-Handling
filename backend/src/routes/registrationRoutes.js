import {Router} from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
const router=Router();
const validId=id=>mongoose.isValidObjectId(id);
router.post("/",async(req,res,next)=>{try{
 const {eventId,studentName,rollNumber,email,phone,department}=req.body;
 if(!eventId||!validId(eventId))return res.status(400).json({message:"Valid eventId is required"});
 const event=await Event.findById(eventId);if(!event)return res.status(404).json({message:"Event not found"});
 if(new Date(event.deadline)<new Date())return res.status(400).json({message:"Registration deadline has passed"});
 if(event.registeredCount>=event.totalSeats)return res.status(400).json({message:"Event is full"});
 const registration=await Registration.create({eventId,studentName,rollNumber,email,phone,department});
 event.registeredCount+=1;await event.save();
 res.status(201).json(registration);
}catch(e){if(e.code===11000)return res.status(409).json({message:"This email or roll number is already registered for this event"});next(e)}});
router.get("/",async(req,res,next)=>{try{
 const filter={};if(req.query.eventId){if(!validId(req.query.eventId))return res.status(400).json({message:"Invalid eventId"});filter.eventId=req.query.eventId}
 res.json(await Registration.find(filter).populate("eventId","title date").sort({registeredAt:-1}));
}catch(e){next(e)}});
router.get("/student",async(req,res,next)=>{try{
 const email=String(req.query.email||"").trim().toLowerCase();if(!email)return res.status(400).json({message:"Email is required"});
 res.json(await Registration.find({email}).populate("eventId","title date").sort({registeredAt:-1}));
}catch(e){next(e)}});
router.get("/:id",async(req,res,next)=>{try{
 if(!validId(req.params.id))return res.status(400).json({message:"Invalid registration id"});
 const reg=await Registration.findById(req.params.id).populate("eventId");if(!reg)return res.status(404).json({message:"Registration not found"});res.json(reg);
}catch(e){next(e)}});
router.delete("/:id",async(req,res,next)=>{try{
 if(!validId(req.params.id))return res.status(400).json({message:"Invalid registration id"});
 const reg=await Registration.findByIdAndDelete(req.params.id);if(!reg)return res.status(404).json({message:"Registration not found"});
 await Event.findByIdAndUpdate(reg.eventId,{$inc:{registeredCount:-1}});
 res.json({message:"Registration cancelled"});
}catch(e){next(e)}});
export default router;
