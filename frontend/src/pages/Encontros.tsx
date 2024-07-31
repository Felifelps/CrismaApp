import React from "react";

import { TablePage } from "./TablePage";

import { apiUrl } from "../utils/constants";
import { formatDate } from "../utils/format";
import { getEncontros, setEncontros } from "../utils/localStorage";

export default function Encontros() {
    function fetchDataFunction(token: any, setData: any, updateLoading: any) {
        const localData = getEncontros();
        if (localData) {
            setData(JSON.parse(localData))
            return updateLoading();
        }

        let responseStatus = 0;
        fetch(apiUrl + '/encontros/', {
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
                setEncontros(JSON.stringify(data));
            }
            updateLoading();
        });
    }

    return (
        <TablePage
            title={"Encontros"}
            newFormPath={"/encontros/new"}
            fetchDataFunction={fetchDataFunction}
            fields={["Tema", "Data"]}
            sortingFunction={(a: any, b: any) => a}
            mappingFunction={(item: any, index: number) => (
                <tr key={index}>
                    <td> {item.tema} </td>
                    <td> {formatDate(item.data)} </td>
                </tr>
            )}
        />
    )
}