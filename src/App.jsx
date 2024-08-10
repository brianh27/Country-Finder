import {useEffect, useState } from 'react'
import axios from 'axios'
const App = () => {
  const [countries,setCountries]=useState(null)
  const [formData,setFormData]=useState('')
  const [res,setWData]=useState({temperature:{min:''},wind:{max:{speed:''}}})
  const API_KEY='397417c2c140e021f6f355ef8d968052'
  function getDate() {
    const date = new Date();
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  function getData(){
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => {
      //console.log(response.data)
      setCountries(response.data)

    })
  }
  function getWeatherData(props){
    const temp=props.country.latlng
    const date=getDate()
    const link=`https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${String(temp[0])}&lon=${String(temp[1])}&date=${date}&appid=${API_KEY}`
    
    axios.get(link).then(response=>{
      setWData(response.data)
    })
  }
  function countryInfo(props){
    const country=props.country
    
    
    getWeatherData({ country: country})
    
    return (
        <div>
          <h1>{country.name.common}</h1>
          <p>capital: {country.capital} </p>
          <p>area: {country.area} </p>
          <p>languages: {Object.values(country.languages).map((n,i)=><li key={i}>{n}</li>)}</p>
          <p><img src={country.flags.png} alt="Flag"/></p>
          <p>temperature: {res.temperature.min} Celcius</p>
          <p>wind: {res.wind.max.speed}m/s</p>

        </div>
   
    )
  }
  const changeForm=(event)=>{
    setFormData(event.target.value)
  }
  useEffect(getData,[])
  if (countries==null){
    return (
      <div>
        <h1>find countries</h1>
      <p>Loading Data Please Wait...</p>
      </div>
    )
  }
  const display=countries.filter(n=>n.name.common.toLowerCase().includes(formData.toLowerCase()))
  
  
  return (
    <div>
      <p>find countries</p>
      <form>
        <input value={formData} onChange={changeForm} />
      </form>
      {display.length===1 ?countryInfo({country:display[0]}):display.map((n,i)=><li key={i}>{n.name.common} <button onClick={()=>setFormData(n.name.common) }>show</button></li>)}
      
    </div>
    
  )
}

export default App
