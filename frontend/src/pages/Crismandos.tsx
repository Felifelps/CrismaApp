import React from "react";

import { TablePage } from "./TablePage";

import { apiUrl } from "../utils/constants";
import { formatDate } from "../utils/format";
import { getCrismandos, setCrismandos } from "../utils/localStorage";

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
            fields={["Nome", "Data Nascimento", "Telefone"]}
            sortingFunction={(a: any, b: any) => a.nome.localeCompare(b.nome)}
            mappingFunction={(item: any, index: number) => (
                <tr key={index}>
                    <td> {item.nome} </td>
                    <td> {formatDate(item.data_nasc)} </td>
                    <td> {item.telefone} </td>
                </tr>
            )}
        />
    )
}