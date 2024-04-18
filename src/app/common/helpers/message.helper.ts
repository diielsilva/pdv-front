import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class MessageHelper {

    public constructor(private messageService: MessageService) { }

    public display(detail: string | undefined, severity: string): void {
        if (detail === undefined) {
            detail = 'Não foi possível conectar ao servidor!';
        }

        this.messageService.add({ detail, severity });
    }

    public hidden(): void {
        this.messageService.clear();
    }
}