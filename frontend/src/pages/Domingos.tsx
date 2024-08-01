import React from "react";
import { Link } from "react-router-dom";

import { TablePage } from "./TablePage";

import { formatDate } from "../utils/format";
import { getDomingos, setCurrentObject } from "../utils/localStorage";
import { getDomingosData } from "../services/getData";

export default function Domingos() {
    return (
        <TablePage
            title={"Domingos"}
            newFormPath={"/domingos/new"}
            getLocalDataFunc={getDomingos}
            getNonLocalDataFunc={getDomingosData}
            fields={["Data", "P", "J", "F"]}
            sortingFunction={(a: any, b: any) => a}
            mappingFunction={(item: any, index: number) => (
                <tr key={index}>
                    <td> 
                        <Link
                            to='/domingos/edit'
                            onClick={() => setCurrentObject(JSON.stringify(item))}
                        >
                            {formatDate(item.data)}
                        </Link>
                    </td>
                    <td> {item.frequenciadomingo.participated} </td>
                    <td> {item.frequenciadomingo.justified} </td>
                    <td> {item.frequenciadomingo.missed} </td>
                </tr>
            )}
        />
    )
}