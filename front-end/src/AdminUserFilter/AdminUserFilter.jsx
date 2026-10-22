import { useState, useEffect } from "react"

import style from "./AdminUserFilter.module.css"

function AdminUserFilter(props){

    const [nikname, setNikname] = useState("")
    const [mail, setMail] = useState("")
    const [role, setRole] = useState("")

    useEffect(() => {
        if (nikname === "" && mail === "" && role === ""){
            props.setUsers(props.stoneUsers)
            return
        }
        
        let filteredUsres = props.stoneUsers.filter((element) => {
            if (nikname !== ""){
                if (!(element.username.includes(nikname))){
                    return false
                }
            }
            if (mail !== ""){
                if (!(element.email.includes(mail))){
                    return false
                }
            }
            if (role !== ""){
                if (!(element.role.includes(role))){
                    return false
                }
            }
            return true
        })

        console.log("filteredUsers: ", filteredUsres)

        props.setUsers(filteredUsres)

    }, [nikname, mail, role])
    
    function reset(){
        setNikname("")
        setMail("")
        setRole("")
    }

    return(
        <>
            <h1>AdminUserFilter</h1>
            <label htmlFor="">Никнейм: </label>
            <input type="text" value={nikname} onChange={(event) => {setNikname(event.target.value)}}/>
            <label htmlFor="">Почта:  </label>
            <input type="text" value={mail} onChange={(event) => {setMail(event.target.value)}}/>
            <label htmlFor="">Роль: </label>
            <select name="" id="" value={role} 
                onChange={(event) => {setRole(event.target.value)}}>
                <option value="">Пусто</option>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="user">user</option>
            </select>
            <button onClick={() => { reset() }}>Сбросить</button>
        </>
    )
}

export default AdminUserFilter