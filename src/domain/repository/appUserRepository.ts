import {AppUser} from "@/domain/appUser";
import {InstagramSession} from "@/domain/instagramSession";

export interface AppUserRepository {

    findById(id: string): Promise<AppUser | undefined>

    save(user: AppUser): Promise<void>

    saveSession(session: InstagramSession): Promise<void>
}