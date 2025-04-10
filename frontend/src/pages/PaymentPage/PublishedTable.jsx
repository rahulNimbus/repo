import React, { useState } from "react";
import { Link } from "react-router-dom";

const PublishedTable = ({ data, loading }) => {
  let tableData = data?.payment || [];
  return (
    <>
      <div className="p-2 pb-0 pt-0 row">
        <div className="table-responsive">
          <table className="table table-dark table-bordered text-center">
            <thead>
              <tr>
                <th>title</th>
                <th>Price</th>
                <th>Sale</th>
                <th>Revenue</th>
                <th>Payments</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="spinner-border text-white" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : tableData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-white py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                tableData.map((item, index) => (
                  <tr key={index}>
                    <td><Link to={`/paymentspage/${item._id}`}>{item.title}</Link></td>
                    <td>₹ {item.amount}</td>
                    <td>{item.customer.length}</td>
                    <td>₹ {item.customer.length * item.amount}</td>
                    <td>
                      {item.enabled ? (
                        <span className="text-success">Enabled</span>
                      ) : (
                        <span className="text-danger">Disabled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PublishedTable;
