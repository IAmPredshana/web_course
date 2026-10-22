import { Outlet, Link } from "react-router-dom"

import style from "./Admin.module.css"

function Admin(){
    return(
        <>
            <h1>Admin Layout</h1>
            <div className={style.containerLinks}>
                <Link to="users" className={style.link}>Пользователи</Link>
                <Link to="books" className={style.link}>Книги</Link>
            </div>
            <Outlet />
        </>
    )
}

export default Admin