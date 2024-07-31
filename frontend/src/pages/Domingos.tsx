import React from "react";
import { Link } from "react-router-dom";

import { TablePage } from "./TablePage";

import { apiUrl } from "../utils/constants";
import { formatDate } from "../utils/format";
import { getDomingos, setDomingos, setCurrentObject } from "../utils/localStorage";

export default function Domingos() {
    function fetchDataFunction(token: any, setData: any, updateLoading: any) {
        const localData = getDomingos();
        if (localData) {
            setData(JSON.parse(localData))
            return updateLoading();
        }

        let responseStatus = 0;
        fetch(apiUrl + '/domingos/', {
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
                setDomingos(JSON.stringify(data));
            }
            updateLoading();
        });
    }

    return (
        <TablePage
            title={"Domingos"}
            newFormPath={"/domingos/new"}
            fetchDataFunction={fetchDataFunction}
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