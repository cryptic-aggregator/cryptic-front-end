import styles from "./styles/navbar.css"

export default function Navbar(){
    return <nav className="nav">
        <a href="/" className="site-title">Site name</a>
        <ul>
            <li>
                <a href="/signin">Log In</a>
            </li>            
            <li>
                <a href="/signup">Get Startef</a>
            </li>
        </ul>
    </nav>
}