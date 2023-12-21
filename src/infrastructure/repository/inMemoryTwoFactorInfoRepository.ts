import {TwoFactorInfoRepository} from "@/infrastructure/repository/twoFactorInfoRepository";
import {singleton} from "tsyringe";
import {TwoFactorInfo} from "@/infrastructure/model/twoFactorInfo";

@singleton()
export class InMemoryTwoFactorInfoRepository implements TwoFactorInfoRepository {

    private readonly map = new Map<string, TwoFactorInfo>()

    async findById(id: string): Promise<TwoFactorInfo | undefined> {
        return this.map.get(id)
    }

    async save(info: TwoFactorInfo): Promise<void> {
        this.map.set(info.id, info)
    }

}