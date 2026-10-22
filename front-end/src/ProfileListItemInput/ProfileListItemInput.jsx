import { useState } from 'react'

import style from './ProfileListItemInput.module.css'


function ProfileListItemInput(props){

    const [value, setValue] = useState(props.value)
    
    return(
        <li className={style.item}
            data-title={props.title}
        >
            <input type="text" className={style.input} value={value} onChange={(event) => {setValue(event.target.value)}} ref={props.tempRef} />
        </li>
    )
}

export default ProfileListItemInput