import { useEffect, useState } from "react"

import style from "./MainPage.module.css"
import MainPageBookCard from "../MainPageBookCard/MainPageBookCard.jsx"

function MainPage(){

    const [allBooks, setAllBooks] = useState([])
    const [numberPage, setNumberPage] = useState(1)
    const [maxCountPage, setMaxCountPage] = useState(undefined)

    useEffect(() => {
        async function load(){
            let result = await fetch(`http://localhost:3000/api/books/getBooksByCountAndPage?count=5&page=1`, {
                method: "GET",
            })
            result = await result.json()
            if (result.answer === "false"){
                console.log(result)
                return
            }
            setAllBooks(result.info)
        }
        load()
    }, [])

    async function clkBtnLast(){
        if (Number(numberPage) === 1)
            return
        let result = await fetch(`http://localhost:3000/api/books/getBooksByCountAndPage?count=${5}&page=${numberPage - 1}`, {
            method: "GET",
        })
        result = await result.json()
        if (result.answer === "false"){
            console.log(result)
            return
        }
        if (result.info.length === 0){
            return
        }
        setAllBooks(result.info)
        setNumberPage((state) => state - 1)
    }

    async function clkBtnNext(){
        let result = await fetch(`http://localhost:3000/api/books/getBooksByCountAndPage?count=${5}&page=${numberPage + 1}`, {
            method: "GET",
        })
        result = await result.json()
        if (result.answer === "false"){
            console.log(result)
            return
        }
        if (result.info.length === 0){
            return
        }
        setAllBooks(result.info)
        setNumberPage((state) => state + 1)
    }

    return(
        <>
        <h1>MainPage</h1>
        <div className={style.mainContainerAllBooks}>
            <h2>Все книги</h2>
            <div className={style.allBooks}>
                {allBooks.length !== 0 ? allBooks.map((element) => <MainPageBookCard book={element} />) : null}
            </div>
            <div className={style.allBooksActions}>
                <button onClick={() => {clkBtnLast()}}>-</button>
                <p className={style.numberPage}>{numberPage}</p>
                <button onClick={() => {clkBtnNext()}}>+</button>
            </div>
        </div>
        </>
    )
}

export default MainPage