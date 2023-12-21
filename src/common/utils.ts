import {cookies} from "next/headers";
import {USER_ID_COOKIE_NAME} from "@/common/consts";

export function randomHumanDelay(): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, Math.round(Math.random() * 2000) + 1000);
    });
}

export function getUserIdFromCookie() {
    return cookies().get(USER_ID_COOKIE_NAME)?.value
}