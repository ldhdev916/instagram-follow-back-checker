import {TwoFactorInfo} from "@/infrastructure/model/twoFactorInfo";

export interface TwoFactorInfoRepository {
    findById(id: string): Promise<TwoFactorInfo | undefined>

    save(info: TwoFactorInfo): Promise<void>
}