import React from 'react';
import '../assets/styles/Header.css';

export default function Header(props: any) {
    let links = props.links;
    let linkObjects = Object.keys(links).map((linkName, index) => {
        return (
            <li key={index}><a href={links[linkName]}>{linkName}</a></li>
        );
    })
    console.log(linkObjects)
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
    )
}

export function CommonHeader() {
    return <Header links={{
        'Login': '/login',
        'Minha Frequência': '/freq'
    }} />
}

export function AdminHeader() {
    return <Header links={{
        'Crismandos': '/crismandos',
        'Encontros': '/Encontros',
        'Domingos': '/domingos',
        'Baixar Dados': '/data',
        'Sair': '/logout'
    }} />
}