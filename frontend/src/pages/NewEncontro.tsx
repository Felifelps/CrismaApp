import React, {useState} from "react";

import NewObjectPage from "./NewObjectPage";

import { addEncontro } from "../services/addObject";

import { removeEncontros } from "../utils/localStorage";

export default function NewEncontro() {
    const [tema, setTema] = useState('');
    const [date, setDate] = useState('');

    return (
        <NewObjectPage
            title={"Encontro"}
            returnToUrl='/enctontros'
            removeLocalDataFunction={removeEncontros}
            createObjectFunction={(token: any, onDone: any) => addEncontro(
                token, tema, date, onDone
            )}
            fields={[{
                    type: 'text',
                    onChange: (e: any) => setTema(e.target.value),
                    label: 'Tema',
                    placeholder: 'Ex: Igreja e a Caridade'
                },
                {
                    type: 'date',
                    onChange: (e: any) => setDate(e.target.value),
                    label: 'Data de nascimento'
                },
            ]}
        />
    )
}