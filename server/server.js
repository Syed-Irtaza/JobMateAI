import express from "express"
import cors from "cors"
import "dotenv/config.js"
import connectDB from "./configs/db.js"
import userRouter from "./routes/userRoutes.js"
import resumeRouter from "./routes/resumeRoutes.js"
import aiRouter from "./routes/aiRoutes.js"
import profileRouter from "./routes/profileRoutes.js"

const app = express()
const PORT = process.env.PORT || 8080

//DB connection

await connectDB()

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>res.send("Server is Alive..."))
app.use('/api/users',userRouter)
app.use('/api/resumes',resumeRouter)
app.use('/api/ai',aiRouter)
app.use('/api/profile',profileRouter)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})
