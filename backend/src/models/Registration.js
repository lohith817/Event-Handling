import mongoose from "mongoose";
const schema=new mongoose.Schema({
 eventId:{type:mongoose.Schema.Types.ObjectId,ref:"Event",required:true},
 studentName:{type:String,required:true,trim:true},
 rollNumber:{type:String,required:true,trim:true},
 email:{type:String,required:true,trim:true,lowercase:true},
 phone:{type:String,required:true,trim:true},
 department:{type:String,required:true,trim:true},
 registeredAt:{type:Date,default:Date.now}
},{timestamps:true});
schema.index({eventId:1,email:1},{unique:true});
schema.index({eventId:1,rollNumber:1},{unique:true});
export default mongoose.model("Registration",schema);
