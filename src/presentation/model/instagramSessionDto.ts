import {InstagramSession} from "@/domain/instagramSession";

export type InstagramSessionDto = Omit<InstagramSession, "serialized">