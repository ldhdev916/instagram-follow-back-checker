import {InstagramSession} from "@/domain/instagramSession";
import {InstagramUser} from "@/application/model/instagramUser";

export interface InstagramApiProvider {
    login(username: string, password: string): Promise<InstagramSession>

    twoFactorLogin(twoFactorId: string, code: string): Promise<InstagramSession>

    getFollowers(session: InstagramSession): Promise<InstagramUser[]>

    getFollowings(session: InstagramSession): Promise<InstagramUser[]>

    unfollow(session: InstagramSession, id: string): Promise<void>
}