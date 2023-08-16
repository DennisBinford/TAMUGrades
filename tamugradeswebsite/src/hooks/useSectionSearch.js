import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useAxiosGetDB(departmentFilter) {
    const [data, setData] = useState([]);
    useEffect(()=>{
        axios.get(`http://localhost:8080/sections?search=department,${departmentFilter}&limit=100`)
        .then(response => {
            console.log(response.data)
            setData(response.data.sections)
        })
    })
    return data
  }