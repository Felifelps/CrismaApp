import { TablePage } from "./TablePage";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/format";
import { getEncontros, removeEncontros } from "../utils/localStorage";
import { getEncontrosData } from "../services/getData";
import { sortByDateStringsDesc } from "../utils/sort";

export default function Encontros() {
    const navigate = useNavigate();
    return (
        <TablePage
            title={"Encontros"}
            newFormPath={"/encontros/new"}
            getLocalDataFunc={getEncontros}
            deleteLocalDataFunc={removeEncontros}
            getNonLocalDataFunc={getEncontrosData}
            fields={["Tema", "Data", "Presenças", "Justificativas", "Faltas"]}
            sortingFunction={(a: any, b: any) => sortByDateStringsDesc(a.data, b.data)}
            mappingFunction={(item: any, index: number) => (
                <tr key={index} className="clickable" onClick={() => navigate(`/encontros/${item.id}`)}>
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