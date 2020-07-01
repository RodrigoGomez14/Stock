import React from 'react'
import {Link} from 'react-router-dom'
export const NotFound = () =>{
    return(
        <div className="container">
            <h1>la pagina no se encuentra disponible</h1>
            <Link to='/'>
                Vuelve al Home
            </Link>
        </div>
    )
}