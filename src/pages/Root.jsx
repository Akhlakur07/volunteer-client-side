import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from '../components/Footer';

const Root = () => {
    return (
        <div>
            <Navbar></Navbar>
            <ToastContainer position="top-right" />
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Root;