

// controllers to register the users

import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Resume from "../models/Resume.js"
import { OAuth2Client } from "google-auth-library"

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const generatToken=(userId)=>{
    // keep a consistent key name so middleware can read it back
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn:'7d'})
    return token
}

//POST: /api/users/register
export const registerUser=async(req,res)=>{
    try {
        const {name, email, password, role = "candidate", companyName, companyWebsite}=req.body

        //check if required fields are present 
        if(!name||!email||!password){
            return res.status(400).json({message:"Required Fields are Missing"})
        }

        if (!["candidate","recruiter"].includes(role)) {
            return res.status(400).json({message:"Invalid role"})
        }

        if (role === "recruiter" && (!companyName || !companyWebsite)) {
            return res.status(400).json({message:"Recruiter details required"})
        }

        //check if user already exists
        const user=await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User already exists"})
        }

        //create new user
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser= await User.create({
            name,
            email,
            password:hashedPassword,
            role,
            companyName: role === "recruiter" ? companyName : undefined,
            companyWebsite: role === "recruiter" ? companyWebsite : undefined,
            profileCompleted: role === "recruiter", // recruiter ready after signup
        })

        //return success message
        const token=generatToken(newUser._id)
        newUser.password=undefined
        return res.status(201).json({message:"User created successfully",token,user:newUser})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


//controller for user login 
//POST: /api/users/login

export const loginUser=async(req,res)=>{
    try {
        const {email, password}=req.body

        // hardcoded admin credential
        if (email === "admin@gmail.com" && password === "123") {
            const adminUser = {
                _id: "000000000000000000000001", // valid ObjectId format
                name: "Admin",
                email: "admin@gmail.com",
                role: "admin",
                provider: "credentials",
                profileCompleted: true,
            };
            const token = generatToken(adminUser._id);
            return res.status(200).json({message:"Login Successful",token,user:adminUser})
        }

        //check if required fields are present 
      
        //check if user already exists
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid email and password"})
        }

        if(user.provider === "google"){
            return res.status(400).json({message:"Use Google sign-in for this account"})
        }


        //check if passsword is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message:"Invalid email and password"})
        }

       
        //return success message
        const token=generatToken(user._id)
        user.password=undefined

        return res.status(200).json({message:"Login Successful",token,user})

    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


//controller for getting user by id
//GET: /api/users/data
export const getUserById=async(req,res)=>{
    try {
        const userId=req.userId

        // Handle hardcoded admin user
        if (userId === "000000000000000000000001") {
            const adminUser = {
                _id: "000000000000000000000001",
                name: "Admin",
                email: "admin@gmail.com",
                role: "admin",
                provider: "credentials",
                profileCompleted: true,
            };
            return res.status(200).json({user: adminUser})
        }

        //check if user exist
        const user = await User.findById(userId)
        if(!user){
        return res.status(404).json({message:"User not found"})
        }
        //return user
        user.password=undefined
        return res.status(200).json({user})


    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


//controller for getting user resumes

//GET: /api/users/resumes

export const getUserResumes=async(req,res)=>{
    try {
        const userId=req.userId

        // Admin doesn't have resumes in the traditional sense
        if (userId === "000000000000000000000001") {
            return res.status(200).json({resumes: []})
        }

        //return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes
            
        })
    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }
}

// POST: /api/users/google
export const googleAuth = async (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ message: "Google client ID is not configured" });
    }

    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ message: "Missing Google credential" });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload || {};

        if (!email) {
            return res.status(400).json({ message: "Google account email is required" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || "Google User",
                email,
                provider: "google",
                googleId,
                picture,
            });
        } else {
            // Keep existing provider for password users but attach Google identifiers
            const updates = {};
            if (!user.googleId) updates.googleId = googleId;
            if (picture && user.picture !== picture) updates.picture = picture;

            if (Object.keys(updates).length) {
                user.set(updates);
                await user.save();
            }

            if (user.provider === "google" && user.googleId && user.googleId !== googleId) {
                return res.status(400).json({ message: "Google account mismatch" });
            }
        }

        const token = generatToken(user._id);
        user.password = undefined;

        return res.status(200).json({ message: "Login Successful", token, user });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};