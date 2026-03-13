import React,{useState,useEffect} from "react"
import {Line} from "react-chartjs-2"
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement
} from "chart.js"

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement)

function Visualizer({path}){

const [animatedPath,setAnimatedPath]=useState([])

useEffect(()=>{

if(!path.length) return

let i=0
setAnimatedPath([path[0]])

const interval=setInterval(()=>{

i++
setAnimatedPath(prev=>[...prev,path[i]])

if(i===path.length-1) clearInterval(interval)

},600)

return()=>clearInterval(interval)

},[path])

const data={

labels:animatedPath.map((_,i)=>`Step ${i}`),

datasets:[
{
label:"Disk Head Movement",
data:animatedPath,
borderColor:"#00bcd4",
backgroundColor:"rgba(0,188,212,0.2)",
borderWidth:3,
pointBackgroundColor:"#ff5722",
pointRadius:6,
tension:0.4
}
]

}

return(

<div style={{width:"800px",margin:"auto"}}>

<Line data={data}/>

</div>

)

}

export default Visualizer