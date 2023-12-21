import {InstagramLoginForm} from "@/presentation/component/instagramLoginForm";
import {getUserIdFromCookie} from "@/common/utils";
import {instagramService} from "@/common/di";
import {Stack} from "@mui/material";
import {InstagramSessionComponent} from "@/presentation/component/instagramSessionComponent";
import {LoginWarningAlert} from "@/presentation/component/loginWarningAlert";
import {cookies} from "next/headers";
import {CONFIRM_COOKIE_NAME} from "@/common/consts";

export default async function Home() {

    const userId = getUserIdFromCookie()

    const sessions = userId ? await instagramService().getSessions(userId) : []

    const confirmed = !!cookies().get(CONFIRM_COOKIE_NAME)

    return <>
        {!confirmed && <LoginWarningAlert/>}

        <Stack gap={4} alignItems="center">

            {
                sessions.map(session => (
                    <InstagramSessionComponent key={session.id} session={session}/>
                ))
            }

            <InstagramLoginForm/>
        </Stack>
    </>
}