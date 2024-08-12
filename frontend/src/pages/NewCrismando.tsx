import { useState } from "react";

import NewObjectPage from "./NewObjectPage";

import { addCrismando } from "../services/addObject";

export default function NewCrismando() {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [tel, setTel] = useState('');

    return (
        <NewObjectPage
            title={"Crismando"}
            returnToUrl='/crismandos'
            createObjectFunction={(token: any, onDone: any) => addCrismando(
                token, name, date, tel, onDone
            )}
            fields={[{
                    type: 'text',
                    onChange: (e: any) => setName(e.target.value),
                    label: 'Nome',
                    placeholder: 'Ex: Fulano da Silva'
                },
                {
                    type: 'date',
                    onChange: (e: any) => setDate(e.target.value),
                    label: 'Data de nascimento',
                },
                {
                    type: 'phone',
                    onChange: (e: any) => setTel(e.target.value),
                    label: 'Número',
                    placeholder: 'Ex: 88 940028922'
                },
            ]}
        />
    )
}