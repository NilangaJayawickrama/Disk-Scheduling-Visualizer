import React,{useState,useEffect} from "react"

function DiskTrack({path}){

const [position,setPosition]=useState(0)

useEffect(()=>{

if(!path.length) return

let i=0
setPosition(path[0])

const interval=setInterval(()=>{

i++
setPosition(path[i])

if(i===path.length-1) clearInterval(interval)

},600)

return()=>clearInterval(interval)

},[path])

return(

<div style={{marginTop:"40px"}}>

<h3>Disk Track Simulation</h3>

<div style={{
position:"relative",
height:"40px",
background:"#1e293b",
borderRadius:"10px"
}}>

<div style={{
position:"absolute",
left:`${(position/200)*100}%`,
top:"-10px",
width:"20px",
height:"60px",
background:"#ff5722",
borderRadius:"5px",
transition:"left 0.5s"
}}/>

</div>

<p>Current Cylinder: {position}</p>

</div>

)

}

export default DiskTrack