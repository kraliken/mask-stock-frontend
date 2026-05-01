import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import DownloadButton from './DownloadButton'
import './OrderHistoryDemo.css'

const API_URL = process.env.REACT_APP_API_URL;

const OrderHistoryDemo = ({ user }) => {
  const [ordersArray, setOrdersArray] = useState([])

  const handleGetOrders = async (hospital) => {

    try {
      const response = await fetch(`${API_URL}/orders`)
      const orders = await response.json()
      const hospitalArr = await fetch(`${API_URL}/hospitals`)
      const hospitals = await hospitalArr.json()
      const hospitalId = hospitals.filter(item => {
        return item.name === hospital
      })
      const filteredOrders = orders.filter(order => order.hospitalPartnerId === hospitalId[0].partner_id)
      setOrdersArray(filteredOrders)
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="order">
      <div className="order-left">
        <p>Töltse le a kórház számláit</p>

        {user && user.hospitals.map(hospital =>
          <button key={uuidv4()} onClick={() => handleGetOrders(hospital)}>{hospital}</button>
        )}
      </div>

      <div className="order-right">
        {ordersArray.length > 0 && ordersArray.map(order => <DownloadButton key={order.invoiceId} invoiceId={order.invoiceId} />)}
      </div>
    </div>
  )
}

export default OrderHistoryDemo
