import mongoose from "mongoose";
const eventSchema=new mongoose.Schema({
 title:{type:String,required:true,trim:true},
 description:{type:String,required:true},
 category:{type:String,enum:["Technical","Cultural","Sports","Workshop"],required:true},
 date:{type:Date,required:true}, time:{type:String,required:true},
 venue:{type:String,required:true}, organiser:{type:String,required:true},
 totalSeats:{type:Number,required:true,min:1}, registeredCount:{type:Number,default:0,min:0},
 deadline:{type:Date,required:true}
},{timestamps:true});
export default mongoose.model("Event",eventSchema);
