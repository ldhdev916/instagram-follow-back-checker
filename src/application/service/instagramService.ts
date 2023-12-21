import {AppUserRepository} from "@/domain/repository/appUserRepository";
import {InstagramApiProvider} from "@/application/service/instagramApiProvider";
import {AppUser} from "@/domain/appUser";
import {TwoFactorLoginRequiredError} from "@/application/error/twoFactorLoginRequiredError";
import {InstagramSessionDto} from "@/presentation/model/instagramSessionDto";
import {InstagramSession} from "@/domain/instagramSession";
import {InstagramSessionNotFoundError} from "@/application/error/instagramSessionNotFoundError";
import {randomHumanDelay} from "@/common/utils";
import {InstagramUser} from "@/application/model/instagramUser";

export class InstagramService {
    constructor(private readonly repository: AppUserRepository, private readonly provider: InstagramApiProvider) {
    }

    async login(userId: string, username: string, password: string): Promise<string | undefined> {
        const user = await this.getOrCreateUser(userId)

        try {
            const session = await this.provider.login(username, password)

            user.sessions.push(session)

            await this.repository.save(user)
        } catch (e) {
            if (e instanceof TwoFactorLoginRequiredError) {
                return e.id
            }

            throw e
        }
    }

    async twoFactorLogin(userId: string, twoFactorId: string, code: string): Promise<void> {
        const user = await this.getOrCreateUser(userId)

        const session = await this.provider.twoFactorLogin(twoFactorId, code)

        user.sessions.push(session)

        await this.repository.save(user)
    }

    async getSessions(userId: string): Promise<InstagramSessionDto[]> {
        const user = await this.getOrCreateUser(userId)

        return user.sessions.map(({id, name, profileUrl}) => {
            return {id, name, profileUrl}
        })
    }

    async getNonFollowers(userId: string, sessionId: string): Promise<InstagramUser[]> {
        const session = await this.getSession(userId, sessionId)

        const followings = await this.provider.getFollowings(session)

        await randomHumanDelay()

        const followers = await this.provider.getFollowers(session)

        const followerIds = new Set(followers.map(({id}) => id))

        return followings.filter(({id}) => !followerIds.has(id))
    }

    async unfollow(userId: string, sessionId: string, targetId: string): Promise<void> {
        const session = await this.getSession(userId, sessionId)

        await this.provider.unfollow(session, targetId)
    }

    private async getSession(userId: string, sessionId: string): Promise<InstagramSession> {
        const user = await this.getOrCreateUser(userId)

        const session = user.sessions.find(s => s.id == sessionId)

        if (!session) throw new InstagramSessionNotFoundError()

        return session
    }

    private async getOrCreateUser(userId: string): Promise<AppUser> {
        let user = await this.repository.findById(userId)

        if (user) return user

        user = {
            id: userId,
            sessions: []
        }

        await this.repository.save(user)

        return user
    }
}