import React from 'react';

import '../assets/styles/Loading.css';

export default function Loading(props: any) {
    return props.active ? (
        <div className='loading-container'>
            <div className='loading'></div>
        </div>
    ) : <></>;
}