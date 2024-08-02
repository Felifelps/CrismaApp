import React from "react";
import { Link } from "react-router-dom";

import { TablePage } from "./TablePage";

import { formatDate } from "../utils/format";
import { getDomingos} from "../utils/localStorage";
import { getDomingosData } from "../services/getData";

export default function Domingos() {
    return (
        <TablePage
            title={"Domingos"}
            newFormPath={"/domingos/new"}
            getLocalDataFunc={getDomingos}
            getNonLocalDataFunc={getDomingosData}
            fields={["Data", "Presenças", "Justificativas", "Faltas"]}
            sortingFunction={(a: any, b: any) => a}
            mappingFunction={(item: any, index: number) => (
                <tr key={index} onClick={() => {window.location.href = `/domingos/${item.id}`}}>
                    <td> {formatDate(item.data)} </td>
                    <td> {item.frequenciadomingo.participated} </td>
                    <td> {item.frequenciadomingo.justified} </td>
                    <td> {item.frequenciadomingo.missed} </td>
                </tr>
            )}
        />
    )
}