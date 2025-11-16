import React, {useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN


export default function MapView(){
const ref = useRef(null)
useEffect(()=>{
if(!ref.current) return
const map = new mapboxgl.Map({
container: ref.current,
style: 'mapbox://styles/mapbox/streets-v11',
center: [77.2, 28.6],
zoom: 10
})


// user location marker
if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(pos =>{
const {longitude, latitude} = pos.coords
new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map)
map.setCenter([longitude, latitude])
})
}


return ()=> map.remove()
}, [])


return (
<div className="bg-white p-4 rounded shadow h-96">
<div ref={ref} className="h-full" />
</div>
)
}