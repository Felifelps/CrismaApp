import React from "react";

import { TablePage } from "./TablePage";

import { formatDate } from "../utils/format";
import { getDomingos} from "../utils/localStorage";
import { getDomingosData } from "../services/getData";
import { sortByDateStringsDesc } from "../utils/sort";

export default function Domingos() {
    return (
        <TablePage
            title={"Domingos"}
            newFormPath={"/domingos/new"}
            getLocalDataFunc={getDomingos}
            getNonLocalDataFunc={getDomingosData}
            fields={["Data", "Presenças", "Justificativas", "Faltas"]}
            sortingFunction={(a: any, b: any) => sortByDateStringsDesc(a.data, b.data)}
            mappingFunction={(item: any, index: number) => (
                <tr key={index} className="clickable" onClick={() => {window.location.href = `/domingos/${item.id}`}}>
                    <td> {formatDate(item.data)} </td>
                    <td> {item.frequenciadomingo.participated} </td>
                    <td> {item.frequenciadomingo.justified} </td>
                    <td> {item.frequenciadomingo.missed} </td>
                </tr>
            )}
        />
    )
}