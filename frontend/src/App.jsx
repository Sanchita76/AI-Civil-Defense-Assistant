import React from 'react'
import Chatbot from './components/Chatbot'
import MapView from './components/MapView'


export default function App(){
return (
<div className="min-h-screen p-4 bg-slate-50">
<h1 className="text-2xl font-semibold mb-4">ResQGuide</h1>
<div className="grid md:grid-cols-2 gap-4">
<Chatbot />
<MapView />
</div>
</div>
)
}