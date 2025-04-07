import React, { useState } from 'react'
import { motion } from "framer-motion";
import Icon from '@mdi/react';
import { mdiInformationSlabCircleOutline } from '@mdi/js';
import { Link } from 'react-router-dom';

function PaymentPage() {

    const [activeTab , setActiveTab] = useState("published")
    return (
        <>
            <motion.div
                // className="row"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
            >
                <div className="bg-dark text-white min-vh-100 p-4">
                    <div className="row">
                        <div className="col-md-12 text-end">
                            <Link to="/createpayment">
                            <button className='btn btn-secondary px-4 rounded-pill '>+ Create Payment Page</button>
                            </Link>
                        </div>
                    </div>
                    <h1 className="text-center m-5 mt-3">Payment Page</h1>
                    <div className="row d-flex justify-content-around mb-3">
                        <div className="col-md-3 border border-light rounded p-3 mb-3">
                            <p>Total Sale <Icon path={mdiInformationSlabCircleOutline} size={0.8} /></p>
                            <div className="d-inline-flex align-items-center">
                                <h3 className="mb-0">1000</h3>
                                <small className="text-small ms-2">same as last week</small>
                            </div>

                        </div>
                        <div className="col-md-3 border border-light rounded p-3 mb-3">
                            <p>Total Revenue <Icon path={mdiInformationSlabCircleOutline} size={0.8} /></p>
                            <div className="d-inline-flex align-items-center">
                                <h3 className="mb-0">₹ 93,34,343</h3>
                                <small className="text-small ms-2">same as last week</small>
                            </div>

                        </div>
                        <div className="col-md-3 border border-light rounded p-3 mb-3">
                            <p>Conversion <Icon path={mdiInformationSlabCircleOutline} size={0.8} /></p>
                            <div className="d-inline-flex align-items-center">
                                <h3 className="mb-0">53%</h3>
                                <small className="text-small ms-2">same as last week</small>
                            </div>

                        </div>
                    </div>


                    <div className="row d-flex mb-3 ps-5">
                        <div className="col-md-2 p-3 mb-3">
                            <button className={`btn btn${activeTab === "published" ? "" : "-outline"}-secondary px-4 rounded-pill text-white`} onClick={() => setActiveTab("published")}>Published (12)</button>
                        </div>
                        <div className="col-md-2 p-3 mb-3">
                            <button className={`btn btn${activeTab === "unpublished" ? "" : "-outline"}-secondary px-4 rounded-pill text-white`} onClick={() => setActiveTab("unpublished")}>Unpublished (12)</button>
                        </div>
                        <div className="col-md-2 p-3 mb-3">
                            <button className={`btn btn${activeTab === "draft" ? "" : "-outline"}-secondary px-4 rounded-pill text-white`} onClick={() => setActiveTab("draft")}>Draft (12)</button>
                        </div>
                        
                    </div>
                </div>

            </motion.div>

        </>
    )
}

export default PaymentPage
