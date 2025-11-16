const express = require('express')
const router = express.Router()
const twilio = require('twilio')


router.post('/sms', async (req,res)=>{
const { to, body } = req.body
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
try{
const message = await client.messages.create({ body, from: process.env.TWILIO_FROM_NUMBER, to })
res.json({ sid: message.sid })
}catch(e){
res.status(500).json({error: e.message})
}
})


module.exports = router