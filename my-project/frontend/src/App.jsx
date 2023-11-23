import { useState } from 'react'
import React from 'react';
import { Outlet } from "react-router-dom";
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from "react";
import Header from './component/Header'
import toast, { Toaster } from 'react-hot-toast';
import { setDataProduct } from './redux/productSlide';
import { useDispatch, useSelector } from 'react-redux';

function App() {

  const dispatch = useDispatch()

  const productData = useSelector((state)=>state.product)
 

  useEffect(()=>{
    (async()=>{
      const res = await fetch (`${import.meta.env.VITE_REACT_APP_SERVER_DOMAIN}/product`)
      const resData = await res.json()
      console.log(resData)
      
      dispatch(setDataProduct(resData))
    })()
  },[])

 

  return (
    <>
    <Toaster/>
    <div className='bg-white'>
        <Header/>
        <main className='pt-16% bg-slate-200 min-h-[calc(100vh)]'>
          <Outlet/>
        </main>
    </div>
    </>
  )
}
export default App
