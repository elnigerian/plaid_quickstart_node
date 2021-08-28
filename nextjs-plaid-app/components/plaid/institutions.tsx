import * as React from "react";
import {useGetInstitutions} from "../../hooks";

type InstitutionsProps = {
    institutionID?: any;
    options ?: any;
    institutionSelected ?: any;
}

/**
 * Represent the institution, aka banks, the client is attempting to connect with.
 *
 * 1. A list of the institutions is presented
 * 2. User selects a bank to move forward
 * 3. Selection of the bank is required to exchange the link token for a public token
 *
 * @constructor
 */
const Institutions: React.FunctionComponent<InstitutionsProps> = ({institutionSelected}) => {
    const [institutions, setInstitutions] = React.useState<any>([]);
    const {institutionData, isGetInstitutionsLoading} = useGetInstitutions();

    React.useEffect(() => {
        setInstitutions(institutionData);
    }, [institutionData, isGetInstitutionsLoading]);



    return (
        <>
                <form>
                    <input type={"hidden"} name="hidden"/>
                    <label> Please select an institution</label>
                    {
                        institutions && institutions.length > 0 &&
                        <select name="institutions" id="institutions" onChange={(e: any) => institutionSelected(e)}>
                            {
                                institutions.map(
                                    (institution: any, index: number) =>
                                        <option value={institution.institution_id} key={index}>{institution.name}</option>
                                )
                            }
                        </select>
                    }
                </form>
        </>
    );
}

export default Institutions;
