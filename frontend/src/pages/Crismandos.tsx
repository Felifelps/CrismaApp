import { useNavigate } from "react-router-dom";
import { TablePage } from "./TablePage";
import { formatDate } from "../utils/format";
import { getCrismandos } from "../utils/localStorage";
import { getCrismandosData } from "../services/getData";
import { sortByText } from "../utils/sort";

export default function Crismandos() {
    const navigate = useNavigate();

    return (
        <TablePage
            title={"Crismandos"}
            newFormPath={"/crismandos/new"}
            fields={["Nome", "Faltas Encontros", "Faltas Domingos", "Telefone", "Data Nascimento"]}
            getLocalDataFunc={getCrismandos}
            getNonLocalDataFunc={getCrismandosData}
            sortingFunction={(a: any, b: any) => sortByText(a.nome, b.nome)}
            mappingFunction={(item: any, index: number) => (
                <tr key={index} className="clickable" onClick={() => navigate(`/crismandos/${item.id}`)}>
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
