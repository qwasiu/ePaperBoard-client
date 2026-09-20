import React from 'react'
import '../assets/css/RectangleDown.css'
import house from '../assets/icons/house.svg'
import armed from '../assets/icons/armed.svg'
import disarmed from '../assets/icons/disarmed.svg'
import error from '../assets/icons/error.svg'
import heater from '../assets/icons/heater.svg'
import alarm from '../assets/icons/alarm.svg'
import boiler from '../assets/icons/boiler.svg'
import irrigation from '../assets/icons/irrigation.svg'


export default function RectangleDown(props) {

  const svgIcons = {error,armed,disarmed,heater,alarm,boiler,irrigation}
  return (
    <div className="rectangledown">
      <div className="rectangledown_up">
      <img src={house} alt="house" />

        <div className="rectangledown_sensors">
          <div className="rectangledown_sensors_in">
            INDOOR:{parseFloat(props.dznData.status.indoor.temp).toFixed(0)} °C
          </div>
          <div className="rectangledown_sensors_out">
            OUTDOOR:{parseFloat(props.dznData.status.outdoor.temp).toFixed(0)} °C
          </div>
          <div className="rectangledown_sensors_power">
            POWER: 0,7A
        </div>
      </div>
      </div>

      <div className="rectangledown_icons">
        <img className='rectangledown_icon' src={svgIcons[props.dznData.state.acces]} alt={props.dznData.state.acces} />
        {props.dznData.state.irrigation === "active" && <img className='rectangledown_icon' src={irrigation} alt="irrigation" />}     
        {props.dznData.state.heater === "active" && <img className='rectangledown_icon' src={heater} alt="heater" />}        
        {props.dznData.state.boiler === "active" && <img className='rectangledown_icon' src={boiler} alt="boiler" />}
        {props.dznData.error && <img className='rectangledown_icon' src={error} alt="error" />}
      </div>
    </div>
  )
}
