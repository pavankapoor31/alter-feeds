import React from 'react'
import { useNavigate } from 'react-router-dom'
const ErrorPage = () => {
    const navigate = useNavigate();
    const redirectHome = () => {
        navigate('/home')
    }
    return (
        <>
            <h1>404 Page not found</h1>
            <button onClick={redirectHome}> Go home </button>
        </>

    )
}

export default ErrorPage