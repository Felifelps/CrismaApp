import UpdateObjectPage from "./UpdateObjectPage";

import { getCrismandos, getDomingos } from "../utils/localStorage";
import { getDomingosData } from "../services/getData";
import { updateDomingo } from "../services/updateObject";
import { formatISODate } from "../utils/format";
import { getDomingoFrequency } from "../services/getFrequency";
import { updateDomingoFrequency } from "../services/updateFrequency";
import { deleteDomingo } from "../services/deleteObject";
import { sortByText } from "../utils/sort";
import { removeCrismandos } from "../utils/localStorage";


export default function UpdateDomingo() {
    function getFrequencyList() {
        let crismandos = getCrismandos();
        return {
            'frequenciadomingo': crismandos ? JSON.parse(crismandos) : {}
        }
    }
    return (
        <UpdateObjectPage
            title={"Domingo"}
            returnToUrl='/domingos'
            propertyName='domingo'
            getNonLocalDataFunction={getDomingosData}
            getLocalDataFunction={getDomingos}
            getLocalObjectFreq={() => {}}
            fetchObjectFreqFunction={getDomingoFrequency}
            getFrequencyListsFunction={getFrequencyList}
            updateObjectFreqFunction={updateDomingoFrequency}
            deleteObjectFunction={deleteDomingo}
            sortingFunction={sortByText}
            removeAsideDataFunction={removeCrismandos}
            freqDataOptions={{
                "frequenciadomingo": {
                    listName: "Crismandos",
                    refAttr: "nome",
                    freqRefName: "crismando"
                },
            }}
            updateObjectFunction={(token: any, id: any, object:any, onDone: any) => updateDomingo(
                token,
                id,
                formatISODate(object.data),
                onDone
            )}
            fields={[
                {
                    type: 'date',
                    label: 'Data',
                    name: 'data'
                }
            ]}
        />
    )
}