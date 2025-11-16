import React, {useState, useEffect} from 'react'
import axios from 'axios'


export default function Chatbot(){
const [messages, setMessages] = useState([])
const [text, setText] = useState('')


const send = async () => {
if(!text) return
const userMsg = {role:'user', text}
setMessages(m => [...m, userMsg])
setText('')


try{
const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/ai/respond`, {
query: text,
// Optionally pass location from browser
})
setMessages(m => [...m, {role:'assistant', text: res.data.answer}])
}catch(err){
setMessages(m => [...m, {role:'assistant', text: 'Error contacting AI service.'}])
}
}


return (
<div className="bg-white p-4 rounded shadow">
<div className="h-96 overflow-auto mb-2 border p-2">
{messages.map((m,i)=> (
<div key={i} className={m.role==='user' ? 'text-right' : 'text-left'}>
<div className="inline-block px-3 py-1 my-1 rounded bg-slate-100">{m.text}</div>
</div>
))}
</div>
<div className="flex gap-2">
<input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Describe the hazard..." />
<button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
</div>
</div>
)
}