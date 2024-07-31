import React from "react";
import { Link } from "react-router-dom";

import { TablePage } from "./TablePage";

import { apiUrl } from "../utils/constants";
import { formatDate } from "../utils/format";
import { getCrismandos, setCrismandos, setCurrentObject } from "../utils/localStorage";

export default function Crismandos() {
    function fetchDataFunction(token: any, setData: any, updateLoading: any) {
        const localData = getCrismandos();
        if (localData) {
            setData(JSON.parse(localData));
            return updateLoading();
        }

        let responseStatus = 0;
        fetch(apiUrl + '/crismandos/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => {
            responseStatus = response.status;
            return response.json();
        }).then(data => {
            if (responseStatus === 200) {
                setData(data);
                setCrismandos(JSON.stringify(data));
            }
            updateLoading();
        });
    }

    return (
        <TablePage
            title={"Crismandos"}
            newFormPath={"/crismandos/new"}
            fetchDataFunction={fetchDataFunction}
            fields={["Nome", "FE", "FD", "Telefone", "Data Nascimento"]}
            sortingFunction={(a: any, b: any) => a.nome.localeCompare(b.nome)}
            mappingFunction={(item: any, index: number) => (
                <tr key={index}>
                    <td> 
                        <Link
                            to='/crismandos/edit'
                            onClick={() => setCurrentObject(JSON.stringify(item))}
                        >
                            {item.nome}
                        </Link>
                    </td>
                    <td> {item.frequenciaencontro.missed} </td>
                    <td> {item.frequenciadomingo.missed} </td>
                    <td> <a href={`https://wa.me/55${item.telefone}`.replaceAll(' ', '')} rel="noreferrer" target="_blank">{item.telefone}</a> </td>
                    <td> {formatDate(item.data_nasc)} </td>
                </tr>
            )}
        />
    )
}