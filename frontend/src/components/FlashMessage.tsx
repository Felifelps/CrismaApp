import React, { useEffect } from 'react';

import '../assets/styles/FlashMessage.css'

import { useFlashMessage } from '../contexts/FlashMessages';

export default function FlashMessage(){
    const { flashMessage, setFlashMessage } = useFlashMessage();

    useEffect(() => {
        if (flashMessage && flashMessage.message) {
            const timer = setTimeout(() => {
                setFlashMessage(null);
            }, 5000); // Mensagem visível por 5 segundos

            return () => clearTimeout(timer);
        }
    }, [flashMessage, setFlashMessage]);

    if (!flashMessage || !flashMessage.message) return null;

    return (
        <div className={`flash-messsage ${flashMessage.type}`}>
            {flashMessage.message}
        </div>
    );
};