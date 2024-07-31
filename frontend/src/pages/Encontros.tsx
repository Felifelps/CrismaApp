import React from "react";
import { Link } from "react-router-dom";

import { TablePage } from "./TablePage";

import { apiUrl } from "../utils/constants";
import { formatDate } from "../utils/format";
import { getEncontros, setEncontros, setCurrentObject } from "../utils/localStorage";

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
            fields={["Tema", "Data", "P", "J", "F"]}
            sortingFunction={(a: any, b: any) => a}
            mappingFunction={(item: any, index: number) => (
                <tr key={index}>
                    <td> 
                        <Link
                            to='/encontros/edit'
                            onClick={() => setCurrentObject(JSON.stringify(item))}
                        >
                            {item.tema}
                        </Link>
                    </td>
                    <td> {item.tema} </td>
                    <td> {formatDate(item.data)} </td>
                    <td> {item.frequenciaencontro.participated} </td>
                    <td> {item.frequenciaencontro.justified} </td>
                    <td> {item.frequenciaencontro.missed} </td>
                </tr>
            )}
        />
    )
}