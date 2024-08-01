import React from "react";
import { Link } from "react-router-dom";

import { TablePage } from "./TablePage";

import { formatDate } from "../utils/format";
import { getEncontros } from "../utils/localStorage";
import { getEncontrosData } from "../services/getData";

export default function Encontros() {
    return (
        <TablePage
            title={"Encontros"}
            newFormPath={"/encontros/new"}
            getLocalDataFunc={getEncontros}
            getNonLocalDataFunc={getEncontrosData}
            fields={["Tema", "Data", "Presenças", "Justificativas", "Faltas"]}
            sortingFunction={(a: any, b: any) => a}
            mappingFunction={(item: any, index: number) => (
                <tr key={index}>
                    <td> 
                        <Link to={`/encontros/${item.id}`}>
                            {item.tema}
                        </Link>
                    </td>
                    <td> {formatDate(item.data)} </td>
                    <td> {item.frequenciaencontro.participated} </td>
                    <td> {item.frequenciaencontro.justified} </td>
                    <td> {item.frequenciaencontro.missed} </td>
                </tr>
            )}
        />
    )
}