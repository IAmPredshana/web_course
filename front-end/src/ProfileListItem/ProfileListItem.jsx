import style from "./ProfileListItem.module.css"

function ProfileListItem(props){

    return(
        <li className={style.item}
            data-title={props.title}
        >
            {props.value}
        </li>
    )
}

export default ProfileListItem