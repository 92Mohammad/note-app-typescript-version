import '../css/navbar.css'
import { Link } from 'react-router-dom'
interface NavBarProps {
    isHome: boolean
}

export default function NavBar({isHome}: NavBarProps){

    return (
        <>
            <nav>
                <h1 className='website-logo'>My Notes</h1>
                <div className = { isHome ? "nav-items-home": "nav-items" }>
                    <Link to = "/">Home</Link>
                    <Link to= "/about">About</Link>
                    <Link to= "/work">Work</Link>
                    <Link to= "/login">LogIn</Link> 
                </div>
            </nav>
        </>
    )
}