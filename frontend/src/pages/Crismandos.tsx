import React from "react";

import { TablePage } from "./TablePage";

import { formatDate } from "../utils/format";
import { getCrismandos } from "../utils/localStorage";
import { getCrismandosData } from "../services/getData";

export default function Crismandos() {
    return (
        <TablePage
            title={"Crismandos"}
            newFormPath={"/crismandos/new"}
            fields={["Nome", "Presenças Encontros", "Presenças Domingos", "Telefone", "Data Nascimento"]}
            getLocalDataFunc={getCrismandos}
            getNonLocalDataFunc={getCrismandosData}
            sortingFunction={(a: any, b: any) => a.nome.localeCompare(b.nome)}
            mappingFunction={(item: any, index: number) => (
                <tr key={index} onClick={() => {window.location.href = `/crismandos/${item.id}`}}>
                    <td> {item.nome} </td>
                    <td> {item.frequenciaencontro.missed} </td>
                    <td> {item.frequenciadomingo.missed} </td>
                    <td> <a
                            href={`https://wa.me/55${item.telefone}`.replaceAll(' ', '')}
                            onClick={(e: any) => e.stopPropagation()}
                            rel="noreferrer"
                            target="_blank"
                        > {item.telefone} 
                    </a> </td>
                    <td> {formatDate(item.data_nasc)} </td>
                </tr>
            )}
        />
    )
}