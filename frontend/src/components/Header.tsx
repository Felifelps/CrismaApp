import React from 'react';
import { Link } from 'react-router-dom';

import '../assets/styles/Header.css';

import {adminLinks, commonLinks} from '../utils/constants'
import { getIsLogged } from '../utils/auth';

export default function Header() {
    let links = getIsLogged() ? adminLinks : commonLinks;
    let linkObjects = Object.keys(links).map((linkName, index) => {
        return (
            <li key={index}><Link to={links[linkName]}>{linkName}</Link></li>
        );
    })
    return (
        <header>
            <div>
                <h1 className='app-title'>CrismaApp</h1>
            </div>
            <nav>
                <ul>
                    {linkObjects}
                </ul>
            </nav>
        </header>
    );
}