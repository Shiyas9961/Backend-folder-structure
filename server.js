require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const root = require('./routes/root')
const employeeRoute = require('./routes/api/employeeRouter')
const registerRoute = require('./routes/registerRoute')
const authRouter = require('./routes/authRoute')
const refreshTokenRouter = require('./routes/refreshToken')
const logOutRouter = require('./routes/logOutRoute')
const userRoute = require('./routes/api/userRoute')
const path = require('path')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const credentails = require('./middleware/credentails')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const corsOption = require('./config/corsOption')
const connectDB = require('./config/connectDB')
const { default: mongoose } = require('mongoose')
const PORT = process.env.PORT

//Connect to MongoDB
connectDB()

//Custome miidleware
app.use(logger)

//This is for security
app.use(credentails)
//CORS middleware
app.use(cors(corsOption))
//json middleware 
app.use(express.json())
//cookie middleware
app.use(cookieParser())
//Static middleware
app.use(express.static(path.join(__dirname,'public')))

//Public routes
app.use('/',root)
app.use('/register',registerRoute)
app.use('/auth',authRouter)
app.use('/logout',logOutRouter)
app.use('/refresh',refreshTokenRouter)

//JWT token check middleware
app.use(verifyJWT)
//Protected routes
app.use('/employee',employeeRoute)
app.use('/users',userRoute)

//Wrong page handling
app.all('*',(req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({message : '404 not found'})
    }else{
        res.type('text').send('404 not found')
    }
})

//Error handler middleware
app.use(errorHandler)

//Condition - The app litsen only when database is connented
mongoose.connection.once('open',() => {
    console.log('MongoDB is connected successfully')
    app.listen(PORT, () => console.log(`Server is running at PORT no. ${PORT}`))
})
