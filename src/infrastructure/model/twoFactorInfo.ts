export type TwoFactorInfo = Readonly<{
    id: string
    username: string
    twoFactorIdentifier: string
    verificationMethod: string
}>