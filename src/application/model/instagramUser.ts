import {InstagramSession} from "@/domain/instagramSession";

export type InstagramUser = Omit<InstagramSession, "serialized">