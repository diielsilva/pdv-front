import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Pageable } from "../utils/pageable";
import { User } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    protected url: string = `${environment.api}/users`;

    public constructor(private httpClient: HttpClient) { }

    public findActive(page: number): Observable<Pageable<User>> {
        return this.httpClient.get<Pageable<User>>(`${this.url}/active?page=${this.calculatePage(page)}`);
    }

    private calculatePage(page: number): number {
        return page - 1;
    }
}