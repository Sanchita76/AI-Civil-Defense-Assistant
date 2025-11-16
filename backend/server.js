require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


const aiRouter = require('./routes/ai')
const weatherRouter = require('./routes/weather')
const alertsRouter = require('./routes/alerts')


const app = express()
app.use(cors())
app.use(express.json())


app.use('/api/ai', aiRouter)
app.use('/api/weather', weatherRouter)
app.use('/api/alerts', alertsRouter)


const PORT = process.env.PORT || 4000


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
console.log('MongoDB connected')
app.listen(PORT, ()=> console.log(`Backend listening on ${PORT}`))
}).catch(err => console.error(err))