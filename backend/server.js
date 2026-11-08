import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import eventRoutes from "./src/routes/eventRoutes.js";
import registrationRoutes from "./src/routes/registrationRoutes.js";
dotenv.config();
const app=express();
app.use(cors({origin:process.env.CLIENT_URL?.split(",") || true}));
app.use(express.json());
app.get("/api/health",(req,res)=>res.json({status:"ok",database:mongoose.connection.readyState===1?"connected":"disconnected"}));
app.use("/api/events",eventRoutes);
app.use("/api/registrations",registrationRoutes);
app.use((req,res)=>res.status(404).json({message:"Route not found"}));
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({message:err.message||"Server error"});});
const PORT=process.env.PORT||5000;
try {
 await mongoose.connect(process.env.MONGODB_URI||"mongodb://127.0.0.1:27017/event_handling");
 console.log("MongoDB connected");
 app.listen(PORT,()=>console.log(`API running at http://localhost:${PORT}`));
} catch(err) { console.error("MongoDB connection failed:",err.message); process.exit(1); }
