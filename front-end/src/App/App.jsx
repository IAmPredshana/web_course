import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'

import Header from "../Header/Header.jsx"
import Footer from "../Footer.jsx"

import style from "./App.module.css"

function App() {

  return (
    <>
    <div className={style.mainContainer}>
      <Header />
      <div className={style.menu}>
        <div className={style.innerMenu}>
          <Link className={style.link} to="/main" >Главный экран</Link>
          <Link className={style.link} to="/searchBook" >Поиск книги</Link>
        </div>
      </div>
      <Outlet />
      <Footer />
    </div>
    </>
  )
}

export default App
