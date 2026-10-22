import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

import SearchBookPageFilter from "../SearchBookPageFilter/SearchBookPageFilter.jsx"
import SearchBookPageMain from "../SearchBookPageMain/SearchBookPageMain.jsx"
import style from "./SearchBookPage.module.css"


function SearchBookPage(){

    const [filters, setFilters] = useState({ title: "", formats: []})

    return(
        <>
            <div className={style.mainContainer}>
                <h1>Поиск книг</h1>
                <div className={style.containerForInfo}>
                    {filters ? <SearchBookPageMain filters={filters} /> : null}
                    <SearchBookPageFilter setFilters={setFilters}/>
                </div>
            </div>
        </>
    )

}

export default SearchBookPage