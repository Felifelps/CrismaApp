import { Link } from 'react-router-dom';

import '../assets/styles/Header.css';

import {adminLinks, commonLinks} from '../utils/constants'

import { useToken } from '../contexts/Token';

export default function Header() {
    const token = useToken().token;
    let links = token ? adminLinks : commonLinks;
    return (
        <header>
            <div>
                <h1 className='app-title'>CrismaApp</h1>
            </div>
            <nav>
                <ul>
                    {Object.keys(links).map((linkName, index) => (
                        <li key={index}><Link to={links[linkName]}>{linkName}</Link></li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}