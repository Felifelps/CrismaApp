import { useState } from "react";

import NewObjectPage from "./NewObjectPage";

import { addDomingo } from "../services/addObject";

import { removeDomingos } from "../utils/localStorage";

export default function NewDomingo() {
    const [date, setDate] = useState('');

    return (
        <NewObjectPage
            title={"Domingo"}
            returnToUrl='/domingos'
            removeLocalDataFunction={removeDomingos}
            createObjectFunction={(token: any, onDone: any) => addDomingo(
                token, date, onDone
            )}
            fields={[{
                type: 'date',
                onChange: (e: any) => setDate(e.target.value),
                label: 'Data'
            }]}
        />
    )
}