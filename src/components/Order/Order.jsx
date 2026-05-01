import React, { useState } from "react";
import DownloadButton from '../OrderHistoryDemo/DownloadButton'

const API_URL = process.env.REACT_APP_API_URL;

function Order({ user, hospitals }) {
  const [selectedHospital, setSelectedHospital] = useState();
  const [quantity, setQuantity] = useState();
  const [response, setResponse] = useState();

  const postOrder = () => {
    const hospitalPartnerId = hospitals.find(
      (hos) => hos.name === selectedHospital
    ).partner_id;

    const order = {
      userName: user.userName,
      hospitalPartnerId: hospitalPartnerId,
      quantity: quantity,
      date: new Date(),
    };

    fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify(order),
    }).then((resp) => resp.json())
      .then((data) => setResponse(data));
  };

  return (
    <div className="order-container">
      <h2>Rendelési űrlap</h2>

      {response ?
        <>
          <div>Sikeres rendelés!</div>
          <DownloadButton invoiceId={response.invoiceId} />
          {/* <button>Invoice</button> */}
        </>
        : <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-div">
            <label htmlFor="hospital">Válasszon kórházat:</label>

            <select name="hospital" id="hospital" onChange={(e) => setSelectedHospital(e.target.value)}>
              <option value="none">-</option>
              {user.hospitals &&
                user.hospitals.map((hosp) => (
                  <option key={hosp} value={hosp}>
                    {hosp}
                  </option>))
              }
            </select>
          </div>

          <div className="form-div">
            <label htmlFor="quantity">Mennyiség</label>
            <input type="text" placeholder="Adja meg a mennyiséget" onChange={(e) => setQuantity(e.target.value)} />
          </div>

          <button disabled={selectedHospital && quantity ? false : true} onClick={postOrder}>
            Küldés
          </button>
        </form>
      }
    </div>
  );
}

export default Order;
