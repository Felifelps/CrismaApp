import React, {useState} from "react";
import { Link } from "react-router-dom";

import UpdateObjectPage from "./UpdateObjectPage";

import { getDomingos, removeDomingos } from "../utils/localStorage";
import { getDomingosData } from "../services/getData";
import { updateDomingo } from "../services/updateObject";
import { formatISODate } from "../utils/format";

export default function UpdateDomingo() {
    return (
        <UpdateObjectPage
            title={"Domingo"}
            returnToUrl='/Domingos'
            getNonLocalDataFunction={getDomingosData}
            getLocalDataFunction={getDomingos}
            removeLocalDataFunction={removeDomingos}
            updateObjectFunction={(token: any, id: any, object:any, onDone: any) => updateDomingo(
                token,
                id,
                formatISODate(object.data),
                onDone
            )}
            fields={[
                {
                    type: 'date',
                    label: 'Data',
                    name: 'data'
                }
            ]}
        />
    )
}