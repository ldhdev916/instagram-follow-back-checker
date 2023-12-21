"use server"

import {createSafeActionClient} from "next-safe-action";
import {getUserIdFromCookie} from "@/common/utils";
import {v4} from "uuid";
import {cookies} from "next/headers";
import {CONFIRM_COOKIE_NAME, USER_ID_COOKIE_NAME} from "@/common/consts";
import {zfd} from "zod-form-data";
import {z} from "zod";
import {instagramService} from "@/common/di";
import {revalidatePath} from "next/cache";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";

const cookieOption: Partial<ResponseCookie> = {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 400
}

const userAction = createSafeActionClient({
    async middleware() {
        let userId = getUserIdFromCookie()

        if (!userId) {
            userId = v4()
        }

        const cookieStore = cookies()

        cookieStore.set(USER_ID_COOKIE_NAME, userId, cookieOption)
        cookieStore.set(CONFIRM_COOKIE_NAME, "보지 말라고", cookieOption)
        cookieStore.set("test", "test", {
            maxAge: 60 * 60 * 24,
            secure: process.env.NODE_ENV === "production",
            httpOnly: true
        })

        return {userId}
    }
})

const loginSchema = zfd.formData({
    username: zfd.text(z.string().min(1)),
    password: zfd.text(z.string().min(1))
})

export const actionLogin = userAction(loginSchema, async ({username, password}, {userId}) => {
    const result = await instagramService().login(userId, username, password)

    if (!result) {
        revalidatePath("/")
    }

    return result
})

const twoFactorLoginSchema = zfd.formData({
    twoFactorId: zfd.text(z.string().min(1)),
    code: zfd.text(z.string().regex(/^\d{6}$/))
})

export const actionTwoFactorLogin = userAction(twoFactorLoginSchema, async ({code, twoFactorId}, {userId}) => {
    await instagramService().twoFactorLogin(userId, twoFactorId, code)

    revalidatePath("/")
})

const getFollowersSchema = z.string().min(1)

export const actionGetNonFollowers = userAction(getFollowersSchema, async (sessionId, {userId}) => {
    return await instagramService().getNonFollowers(userId, sessionId)
})

const unfollowSchema = z.object({
    sessionId: z.string().min(1),
    targetId: z.string().min(1)
})

export const actionUnfollow = userAction(unfollowSchema, async ({sessionId, targetId}, {userId}) => {
    await instagramService().unfollow(userId, sessionId, targetId)
})

export const actionConfirm = userAction(z.void(), async () => {
    revalidatePath("/")
})