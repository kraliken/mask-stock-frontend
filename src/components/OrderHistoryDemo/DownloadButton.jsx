import React, { useEffect, useState } from 'react'

const DownloadButton = ({ invoiceId }) => {
  const [invoiceData, setInvoiceData] = useState(null)

  useEffect(() => {
    const handleGetURL = async () => {
      const response = await fetch("http://localhost:5000/urls", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: invoiceId })
      });

      const data = await response.json()
      setInvoiceData(data)
    }

    handleGetURL()
  }, [invoiceId])

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <>
      {
        invoiceData !== null
          ? <div className="invoice">
            <p>számlaszám: {invoiceData.invoice.invoice_number}</p>
            <a href={invoiceData.url.public_url} target="_blank" rel="noreferrer">letöltés</a>
          </div>
          : <p>betöltés...</p>
      }
    </>
  )
}

export default DownloadButton