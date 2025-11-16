const express = require('express')
const axios = require('axios')
const router = express.Router()


// Proxy to AI microservice
router.post('/respond', async (req,res)=>{
try{
const { query, location } = req.body
const resp = await axios.post(process.env.AI_SERVICE_URL || 'http://localhost:5000/ai/respond', { query, location })
return res.json({ answer: resp.data.answer, meta: resp.data.meta })
}catch(e){
console.error(e.message)
res.status(500).json({ error: 'AI service error' })
}
})


module.exports = router