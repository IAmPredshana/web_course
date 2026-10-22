import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

import style from "./Register.module.css"

import { useUser } from "../store/userStore.js"

function Register(){

    const [nikname, setNikname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [elsePassword, setElsePassword] = useState("")
    
    const register = useUser((state) => state.register)
    
    const navigate = useNavigate()

    const preRegister = async function(){
        
        if (!(password === elsePassword)){
            console.log("Пароли не совпадают!")
            return
        }
        
        const result = await register({nikname: nikname, email: email, password: password})
        
        if (!result){
            return
        }
        
        navigate("/user")
    }

    console.log(nikname)

    return(
        <>
        <div className={style.mainContainer}>
            <div className={style.containerInner}>
                <h1>Регистрация</h1>
                <div className={style.containerInputs}>
                    <label htmlFor="nikname">Никнейм:</label>
                    <input type="text" id="nikname" onChange={(event) => {setNikname(event.target.value)}}/>
                    <label htmlFor="email">Почта:</label>
                    <input type="text" id="email" onChange={(event) => {setEmail(event.target.value)}}/>
                    <label htmlFor="password">Пароль:</label>
                    <input type="email" id="password" onChange={(event) => {setPassword(event.target.value)}}/>
                    <label htmlFor="elsepassword">Повторите пароль:</label>
                    <input type="text" id="elsepassword" onChange={(event) => {setElsePassword(event.target.value)}}/>
                </div>
                <button
                className={style.button}
                onClick={() => {preRegister()}}
                >Зарегестрироваться</button>
                <Link
                to="/user/login"
                className={style.link}
                >Авторизация</Link>
            </div>
        </div>
        </>
    )
}

export default Register