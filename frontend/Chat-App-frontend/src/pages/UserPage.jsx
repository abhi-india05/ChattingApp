import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function UserPage(){
    const{username}=useParams();

   const[data,setData]=useState([]);

   useEffect(()=>{
    axios.get('/user/${username}')
    .then(response=>setData(response))
    .catch(error=>console.log(error));

   },[username]);

   return(
    <div>
        <h1>Chats</h1>
        <ul>
            {data? data.map((item,index)=>(
                <li key={index}>{item.name}</li>
            )):<p>No data available</p>}
           
        </ul>
    </div>
   )
};
