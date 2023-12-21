import "reflect-metadata"
import {container, instanceCachingFactory} from "tsyringe";
import {InstagramService} from "@/application/service/instagramService";
import {LibInstagramApiProvider} from "@/infrastructure/service/libInstagramApiProvider";
import {InMemoryTwoFactorInfoRepository} from "@/infrastructure/repository/inMemoryTwoFactorInfoRepository";
import {PrismaAppUserRepository} from "@/infrastructure/repository/prismaAppUserRepository";
import {AppUserRepository} from "@/domain/repository/appUserRepository";

container.register(LibInstagramApiProvider, {
    useFactory: instanceCachingFactory(container => {
        return new LibInstagramApiProvider(container.resolve(InMemoryTwoFactorInfoRepository), appUserRepository())
    })
})

container.register(InstagramService, {
    useFactory: instanceCachingFactory(container => {
        return new InstagramService(appUserRepository(), container.resolve(LibInstagramApiProvider))
    })
})

export const instagramService = () => container.resolve(InstagramService)

const appUserRepository = () => container.resolve<AppUserRepository>(PrismaAppUserRepository)