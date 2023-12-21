import {InstagramApiProvider} from "@/application/service/instagramApiProvider";
import {InstagramSession} from "@/domain/instagramSession";
import {InstagramUser} from "@/application/model/instagramUser";
import {Feed, IgApiClient, IgLoginTwoFactorRequiredError} from "instagram-private-api";
import {TwoFactorInfoRepository} from "@/infrastructure/repository/twoFactorInfoRepository";
import {v4} from "uuid";
import {TwoFactorInfo} from "@/infrastructure/model/twoFactorInfo";
import {TwoFactorLoginRequiredError} from "@/application/error/twoFactorLoginRequiredError";
import {AppUserRepository} from "@/domain/repository/appUserRepository";


export class LibInstagramApiProvider implements InstagramApiProvider {

    private readonly map = new Map<string, IgApiClient>()

    constructor(private readonly repository: TwoFactorInfoRepository, private readonly userRepository: AppUserRepository) {
    }

    async login(username: string, password: string): Promise<InstagramSession> {
        const [client, serialized] = this.initAuthClient(username)

        try {
            const user = await client.account.login(username, password)

            return {
                id: user.username,
                name: user.full_name,
                profileUrl: user.profile_pic_url,
                serialized: await serialized
            }
        } catch (e) {
            if (e instanceof IgLoginTwoFactorRequiredError) {
                const id = v4()

                const {username, totp_two_factor_on, two_factor_identifier} = e.response.body.two_factor_info

                const info: TwoFactorInfo = {
                    id,
                    username,
                    twoFactorIdentifier: two_factor_identifier,
                    verificationMethod: totp_two_factor_on ? "0" : "1"
                }

                await this.repository.save(info)

                throw new TwoFactorLoginRequiredError(id)
            }

            throw e
        }
    }

    async twoFactorLogin(twoFactorId: string, code: string): Promise<InstagramSession> {
        const info = await this.repository.findById(twoFactorId)

        if (!info) {
            throw new Error("Two factor info not found")
        }

        const [client, serialized] = this.initAuthClient(info.username)

        await client.account.twoFactorLogin({
            username: info.username,
            twoFactorIdentifier: info.twoFactorIdentifier,
            verificationMethod: info.verificationMethod,
            verificationCode: code,
            trustThisDevice: "1"
        })
        const user = await client.account.currentUser()

        return {
            id: user.username,
            name: user.full_name,
            profileUrl: user.profile_pic_url,
            serialized: await serialized
        }
    }

    async getFollowers(session: InstagramSession): Promise<InstagramUser[]> {
        const result = await this.getAllItemsFromFeed((await this.getClient(session)).feed.accountFollowers())

        return result.map(item => ({
            id: item.username,
            name: item.full_name,
            profileUrl: item.profile_pic_url
        }))
    }

    async getFollowings(session: InstagramSession): Promise<InstagramUser[]> {
        const result = await this.getAllItemsFromFeed((await this.getClient(session)).feed.accountFollowing())

        return result.map(item => ({
            id: item.username,
            name: item.full_name,
            profileUrl: item.profile_pic_url
        }))
    }

    async unfollow(session: InstagramSession, id: string): Promise<void> {
        const client = await this.getClient(session)

        const pk = await client.user.getIdByUsername(id)

        await client.friendship.destroy(pk)
    }

    private async getClient(session: InstagramSession): Promise<IgApiClient> {
        let result = this.map.get(session.id);

        if (!result) {
            result = await this.initDefaultClient(session)

            this.map.set(session.id, result)
        }

        return result
    }

    private async initDefaultClient(session: InstagramSession): Promise<IgApiClient> {
        const client = new IgApiClient()
        client.state.generateDevice(session.id)

        client.request.end$.subscribe(async () => {
            const serialized = await client.state.serialize()
            delete serialized.constants

            await this.userRepository.saveSession({
                ...session,
                serialized: JSON.stringify(serialized)
            })
        })

        await client.state.deserialize(JSON.parse(session.serialized))

        return client
    }

    private initAuthClient(username: string): [IgApiClient, Promise<string>] {

        const client = new IgApiClient()

        client.state.generateDevice(username)

        const serialized = new Promise<string>(resolve => {
            client.request.end$.subscribe(async () => {
                const serialized = await client.state.serialize()
                delete serialized.constants

                const s = JSON.stringify(serialized)

                if (s.includes("ds_user_id")) {
                    resolve(s)
                }
            })
        })

        return [client, serialized]
    }

    private async getAllItemsFromFeed<T>(feed: Feed<any, T>): Promise<T[]> {
        let items: T[] = []
        do {
            items = items.concat(await feed.items())

            await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 30) + 30))
        } while (feed.isMoreAvailable())

        return items
    }

}