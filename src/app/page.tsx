import {InstagramLoginForm} from "@/presentation/component/instagramLoginForm";
import {getUserIdFromCookie} from "@/common/utils";
import {instagramService} from "@/common/di";
import {Stack} from "@mui/material";
import {InstagramSessionComponent} from "@/presentation/component/instagramSessionComponent";
import {LoginWarningAlert} from "@/presentation/component/loginWarningAlert";
import {cookies} from "next/headers";
import {CONFIRM_COOKIE_NAME, USER_ID_COOKIE_NAME} from "@/common/consts";

export default async function Home() {

    console.log("----------------------------------")
    console.log(typeof window)
    console.log(cookies().getAll())

    const userId = getUserIdFromCookie()

    console.log("userId", userId)
    console.log("user cookie", cookies().get(USER_ID_COOKIE_NAME))

    const sessions = userId ? await instagramService().getSessions(userId) : []

    const confirmed = !!cookies().get(CONFIRM_COOKIE_NAME)

    console.log("confirmed", confirmed)
    console.log("confirmed cookie", cookies().get(CONFIRM_COOKIE_NAME))
    console.log("----------------------------------")

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