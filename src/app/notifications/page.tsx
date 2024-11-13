"use client"

import { Authorize } from "@/components/common/Authorize";
import Notification from "@/components/notification/Notification";
import { ROLE } from "@/helpers/constants";

const NotificationPage =() => {
    console.log("Rendering NotificationPage");

    return (
        <Authorize roles={[ROLE.superAdmin,ROLE.admin]}>
            <Notification />
        </Authorize>
    )

}

export default NotificationPage;