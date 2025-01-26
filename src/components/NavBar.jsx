import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <>
        <nav>
            <ul>
                <div className="nav-links">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/albums">Albums</NavLink></li>
                    <li><NavLink to="/artists">Artists</NavLink></li>
                    <li><NavLink to="/playlists">Playlists</NavLink></li>
                </div>
            </ul>
        </nav>
        </>
    )
}