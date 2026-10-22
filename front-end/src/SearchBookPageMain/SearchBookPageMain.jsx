import { useEffect, useState } from "react"

import styles from "./SearchBookPageMain.module.css"

function SearchBookPageMain(props){
    const [books, setBooks] = useState([])
    const [numberPage, setNumberPage] = useState(1)

    async function loadAllBooks(page){ 
        let result = await fetch(`http://localhost:3000/api/books/getBooksByCountAndPage?count=3&page=${page}`)
        result = await result.json()
        setBooks(result.info)
    }
    async function loadBooksFilter(page){
        let query = `http://localhost:3000/api/books/getBooksByCountAndPageWithFilters?count=3&page=${page}`
        let keys = Object.keys(props.filters)
        // Проходим по всем фильтрам (подготовка запроса)
        for (let i = 0; i < keys.length; i++) {
            // Если текущий фильтр не пуст
            if (props.filters[keys[i]].length !== 0){
                // Проходимся по всем значениям фильтра
                query += "&"
                // Если это название книги, то просто добавляем всё название
                if (keys[i] === "title")
                    query += `title=${props.filters[keys[i]]}`
                
                // Если это массив то добавляем все элементы массива (так как форматы, пользователи, теги, жанры это всё массивы значений, а название просто строка)
                else {
                    for (let j = 0; j < props.filters[keys[i]].length; j++){
                        query += `${keys[i]}=${props.filters[keys[i]][j]}`
                        if ((Number((j + 1)) <= Number((props.filters[keys[i]].length - 1)))) 
                            query += "&"
                    }
                }
            }
        }

        let result = await fetch(query, {
            method: "GET",
        })
        result = await result.json()
        console.log(result)
        setBooks(result.info)
        
    }   
    
    function checkFilters() {
       return props.filters.title !== "" || (props.filters.formats?.length ?? 0) !== 0
    }

    useEffect(() => {
        let temp = 1
        const hasFilters = checkFilters()

        if (hasFilters) {
            // console.log("Filtered books")
            loadBooksFilter(temp)
        } else {
            // console.log("All books")
            loadAllBooks(temp)
        }

        // Обнавлять страницу, так как новые фильтры?
        setNumberPage(1)

    }, [props.filters])
    
    function next(){
        let temp = numberPage + 1
        setNumberPage((state) => state + 1)
        const hasFilters = checkFilters()
        if (hasFilters)
            loadBooksFilter(temp)
        else
            loadAllBooks(temp)
    }

    function last(){
        let temp = numberPage - 1
        setNumberPage((state) => state - 1)
        const hasFilters = checkFilters()
        if (hasFilters)
            loadBooksFilter(temp)
        else
            loadAllBooks(temp)
    }

    return(
        <>
            <div>
                <h2>Книги</h2>
                <div>
                    {books.map((element) => <div>{element.title}</div>)}
                </div>
                <div>
                    <button onClick={() => { last() }}>-</button>
                    <p>{numberPage}</p>
                    <button onClick={() => { next() }}>+</button>
                </div>
            </div>
        </>
    )
}

export default SearchBookPageMain