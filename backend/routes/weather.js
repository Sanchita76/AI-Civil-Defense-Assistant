const express = require('express')
const axios = require('axios')
const router = express.Router()


router.get('/current', async (req,res)=>{
const { lat, lon } = req.query
try{
const key = process.env.OPENWEATHERMAP_KEY
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
const r = await axios.get(url)
res.json(r.data)
}catch(e){
res.status(500).json({error:'weather fetch failed'})
}
})


module.exports = router