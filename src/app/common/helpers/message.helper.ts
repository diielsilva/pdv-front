import { Injectable, inject } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class MessageHelper {
    private messageService = inject(MessageService)


    displayMessage(detail: string | undefined, severity: string): void {
        if (detail === undefined) {
            detail = 'Não foi possível conectar ao servidor!'
        }

        this.messageService.add({ detail, severity })
    }

    hiddenMessage(): void {
        this.messageService.clear()
    }
}