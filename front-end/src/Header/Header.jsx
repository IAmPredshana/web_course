import { Link } from "react-router-dom"

import style from "./Header.module.css"

import { useUser } from "../store/userStore.js"

function Header(){

    const isLogin = useUser((state) => state.isLogin)

    return(
        <>
            <div className={style.menu}>
                <h1 className={style.title}>BookHive</h1>
                {!isLogin ? <div className={style.subMenu}>
                    <Link to="/user/login" className={style.link}>Авторизация</Link>
                    <Link to="/user/register" className={style.link}>Регистрация</Link>
                </div> : <Link to="user" className={style.link}>Профиль</Link>
                }
            </div>
        </>
    )
}

export default Header