import {AppUserRepository} from "@/domain/repository/appUserRepository";
import {singleton} from "tsyringe";
import {AppUser} from "@/domain/appUser";
import {PrismaClient} from "@prisma/client";
import {InstagramSession} from "@/domain/instagramSession";

@singleton()
export class PrismaAppUserRepository implements AppUserRepository {

    private readonly client = new PrismaClient()

    async findById(id: string): Promise<AppUser | undefined> {
        const result = await this.client.appUser.findUnique({
            where: {id},
            include: {
                sessions: true
            }
        })

        if (!result) return

        return {
            id: result.id,
            sessions: result.sessions.map(session => ({
                id: session.id,
                name: session.name,
                profileUrl: session.profileUrl,
                serialized: session.serialized
            }))
        }
    }

    async save(user: AppUser): Promise<void> {

        await this.client.appUser.upsert({
            where: {
                id: user.id
            },
            create: {
                id: user.id,
                sessions: {
                    create: user.sessions
                }
            },
            update: {
                sessions: {
                    connectOrCreate: user.sessions.map(session => ({
                        where: {id: session.id},
                        create: session
                    }))
                }
            },
        })
    }

    async saveSession(session: InstagramSession): Promise<void> {
        await this.client.instagramSession.upsert({
            where: {id: session.id},
            create: session,
            update: session
        })
    }

}