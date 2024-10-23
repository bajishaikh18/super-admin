"use client"

import { Authorize } from "@/components/common/Authorize";
import Agencies from "../../components/agencies/Agencies";
import { ROLE } from "@/helpers/constants";

const AgenciesPage =() => {
    return (
        <Authorize roles={[ROLE.superAdmin,ROLE.admin]}>
            <Agencies />
        </Authorize>
    )

}

export default AgenciesPage;