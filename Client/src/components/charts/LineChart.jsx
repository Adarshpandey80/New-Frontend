import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'

function LineChart() {

    const fetchdata = async ()=>{
         const api = "http://localhost:8080/data/lineChart"
    const response = await axios.get(api)
    console.log(response.data)
    }

useEffect(()=>{
    fetchdata()
} ,[])
   
  return (
   <>
    <h1>Line Chart</h1>
   </>
  )
}

export default LineChart