import React, { useState, useEffect} from 'react';import '../assets/css/LeftSide.css'
import fetchPlus from '../modules/FetchPlus';

import LeftSide from './LeftSide'
import RightSide from './RightSide'
import SunCalc from 'suncalc';


const serverAddr = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_ADDR : '';

function Main() {

  const [envData, setEnvData] = useState(undefined);
  const [moonIcon, setMoonIcon] = useState(0.5);
  const [forecast, setForecast] = useState({
      current:{
        date:"00",
        sunrise:1702910579,
        sunset:1702910579,
        temp:"00",
        humidity:100,
        pressure:1000,
        icon:"10n",
      },
      hourly:[
        {
        temp:"00",
        icon:"10n",
        date:"00"},
        {
        temp:"00",
        icon:"10n",
        date:"00"},
        {
        temp:"00",
        icon:"10n",
        date:"00"
        }
      ],
      polution:"error"
  });
  const [sensorData, setSensorData] = useState({
    temp: 0,
    humidity: 0
  });
  const [dznData,setDznData] = useState({
    state:{"acces":"error","boiler":"error","heater":"error","irrigation":"error"},
    status:{indoor:{temp:0},outdoor:{temp:0}},
    error: true
  });

  useEffect(() => {
    const fetchEnvData = async () => {
      try {
        console.log('fetching env data',serverAddr)
        const response = await fetchPlus(`${serverAddr}/envdata`);
  
        setEnvData(response)
      }
      catch (error) {
        console.error('Error:', error);
      }
    }
    fetchEnvData();
  }, []);

  useEffect(() => {
    if(envData !== undefined) {
    const fetchDznData = async () => {
      try {
        const automation = await fetchPlus(`http://${envData.oldBoardIP}:${envData.oldBoardPort}/automation`);
        setDznData({ ...automation, error: false });
      } catch (error) {
        setDznData((prev) => ({ ...prev, error: true }));
      }
    }
    const fetchForecast = async () => {
      let data
      try {
         data = await fetchPlus(`http://${envData.oldBoardIP}:${envData.oldBoardPort}/forecast/getforecast?city=${envData.forecastCity}`)
      }
      catch (error) {
        return;
      }

      const currentForecast = {
        date:data.current.dt * 1000,
        sunrise: new Date(data.current.sunrise * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        sunset:new Date(data.current.sunset * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        temp:data.current.temp,
        humidity:data.current.humidity,
        pressure:data.current.pressure,
        icon:data.current.weather[0].icon,
      }

      const hourlyForecast = [data.hourly[3],data.hourly[6],data.hourly[9]].map((hour) => {
        const date = new Date(hour.dt * 1000); // convert to milliseconds by multiplying by 1000
        const dateString = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        return {
          temp:hour.temp,
          icon:hour.weather[0].icon,
          date:dateString
        }
      })

      let polutionForecast = "error"
      switch (data.toxic.list[0].main.aqi) {
        case 1:
           polutionForecast = "good"
          break;
        case 2:
           polutionForecast = "moderate"
          break;
        case 3:
           polutionForecast = "moderate"
          break;
        case 4:
           polutionForecast = "bad"
          break;
        case 5:
           polutionForecast = "scull"
          break;
        default:
           polutionForecast = "error"
      }

      setForecast({
        current:currentForecast,
        hourly:hourlyForecast,
        polution:polutionForecast
      });
    };
    const calcMoonPhase = () => {

      const moonPhase = SunCalc.getMoonIllumination(/*Date*/new Date()).phase;
      let moonIcon = "0"
      if (moonPhase === 0) {
        moonIcon = "0";
      } else if (moonPhase > 0 && moonPhase < 0.25) {
        moonIcon = "1";
      } else if (moonPhase === 0.25) {
        moonIcon = "2";
      } else if (moonPhase > 0.25 && moonPhase < 0.5) {
        moonIcon = "3";
      } else if (moonPhase === 0.5) {
        moonIcon = "4";
      } else if (moonPhase > 0.5 && moonPhase < 0.75) {
        moonIcon = "5";
      } else if (moonPhase === 0.75) {
        moonIcon = "6";
      } else if (moonPhase > 0.75 && moonPhase < 1) {
        moonIcon = "7";
      } else if (moonPhase === 1) {
        moonIcon = "0";
      }
      setMoonIcon(moonIcon);
    }
    const fetchSensorData = async () => {
      try {
        const data = await fetchPlus(`http://${envData.newBoardIP}:${envData.newBoardPort}/sensor`);
          setSensorData(data);
      } catch (error) {
        // Handle the error according to your application's needs
      }
    };

    fetchSensorData();

    fetchDznData();
    calcMoonPhase()
    fetchForecast();

    const intervalHandler = setInterval(()=>{
      fetchDznData();
      fetchSensorData();
      calcMoonPhase()
      fetchForecast();
    }, 6000);
      
    return () => clearInterval(intervalHandler); // cleanup on component unmount
  }
  }, [envData]);

  return (
    <div className='App-main'>
      <LeftSide forecast={forecast} sensorData={sensorData}/>
      <RightSide forecast={forecast} moonIcon={moonIcon} dznData={dznData}/> 
    </div>
  )
}

export default Main
