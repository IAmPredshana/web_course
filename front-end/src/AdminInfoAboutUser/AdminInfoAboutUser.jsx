import { useState } from "react"

import style from "./AdminInfoAboutUser.module.css"
import { useUser } from "../store/userStore.js"

function AdminInfoAboutUser(props){

    // Типо информация которая была изначально
    const firstInfoUser = props.userInfo
    // Типо информация которая изменилась
    const [userInfo, setUserInfo] = useState({...props.userInfo})
    const [loading, setLoadin] = useState("")
    const [error, setError] = useState("")
    
    const token = useUser((state) => state.token)
    
    function isInfoChanged(){
        let flag = false
        const objKeys = Object.keys(props.userInfo)
        for (let i = 0; i < objKeys.length; i++){
            if (firstInfoUser[`${objKeys[i]}`] != userInfo[`${objKeys[i]}`]){
                // console.log(`${firstInfoUser[`${objKeys[i]}`]} ----- ${userInfo[`${objKeys[i]}`]}`)
                flag = true
                break
            }
        }
        return flag
    }
    
    // Пока что только сохранение изменения роли пользователя
    async function saveChanges(){
        setLoadin(true)
        if (firstInfoUser.role === userInfo.role)
            return

        console.log(`user: ${firstInfoUser.username}`)
        console.log(`old role: ${firstInfoUser.role}`)
        console.log(`new role: ${userInfo.role}`)

        let resultChangesUserRole = await fetch("http://localhost:3000/api/users/changeRoleUser", {
            method: "POST",
            headers: {
                "Authorization": "Barer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId: firstInfoUser.id, newRole: userInfo.role})
        })

        resultChangesUserRole = await resultChangesUserRole.json()

        if (resultChangesUserRole.answer === "false"){
            setError(resultChangesUserRole.info)
            setLoadin(false)
            return
        }



        props.setUsers((state) => {
            let temp = []
            state.forEach((element) => {
                if (element.id !== firstInfoUser.id){
                    temp.push(element)
                } else {
                    element.role = userInfo.role
                    temp.push(element)
                }
            });
            return temp
        })

        setLoadin(false)
    }

    async function deleteUser(){
        setLoadin(true)
        let resultDeleteUser = await fetch(`http://localhost:3000/api/users/deleteUserById/${userInfo.id}`, {
            method: "POST",
            headers:{
                "Authorization": "Barer " + token,
            }
        })
        resultDeleteUser = await resultDeleteUser.json()
        
        if (resultDeleteUser.answer === "false"){
            setError(resultDeleteUser.info)
            setLoadin(false)
            return
        }

        setLoadin(false)
        props.deleteUserFromUsers(userInfo.id)
    }

    return(
        <>
        <div className={style.walppaper}>
            <div className={style.mainContainer}>
                <ul className={style.containerUser}>
                    <li>{props.userInfo.id}</li>
                    <li>{props.userInfo.email}</li>
                    <li>{props.userInfo.username}</li>
                    <li>
                        <select name="" id=""
                            className={style.select}
                            value={userInfo.role}
                            onChange={(event) => setUserInfo({...userInfo, "role": event.target.value})}>
                            <option value="admin" >admin</option>
                            <option value="user">user</option>
                            <option value="editor">editor</option>
                        </select>
                    </li>
                </ul>
            </div>
            <div className={style.containerButtoms}>
                {isInfoChanged() ? <button className={style.button} onClick={() => { saveChanges() }}>Сохранить изменения</button> : null}
                <button className={`${style.button} ${style.buttonDelete}`} onClick={() => { deleteUser() }}>Удалить полльзователя</button>
            </div>
        </div>
        </>
    )
}

export default AdminInfoAboutUser