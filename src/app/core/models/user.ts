import { Model } from "./model";

export interface User extends Model {
    name: string,
    username: string,
    role: string
}