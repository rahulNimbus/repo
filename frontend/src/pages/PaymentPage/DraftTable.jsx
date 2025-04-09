import React from 'react'

function DraftTable() {
  return (
    <>
    <div className="p-5 pb-0 pt-0 row">
      <div className="table-responsive">
       
        <table className="table table-dark table-bordered text-center">
          <thead>
            <tr>
              <th >Date</th>
              <th>Customer Detail</th>
              <th >Product</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((item, index) => (
              <tr key={index}>
                <td >23 March 2025, 12:00</td>
                <td>
                  Name Mobile Number
                </td>
                <td >
                  {index === 0
                    ? "Payment Page\nName Of Page"
                    : index === 1
                    ? "Telegram Subscription"
                    : "Locked Content"}
                </td>
                <td>
                  1000
                  <br />
                  Successful / Failed
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  )
}

export default DraftTable
