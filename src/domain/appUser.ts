import {InstagramSession} from "@/domain/instagramSession";

export type AppUser = Readonly<{
    id: string
    sessions: InstagramSession[]
}>