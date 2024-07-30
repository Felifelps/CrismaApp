import React from 'react';

import '../assets/styles/Main.css'

export default function Main(props: any) {
    return (
        <main>
            <div className='main'>
                {props.children}
            </div>
        </main>
    );
}