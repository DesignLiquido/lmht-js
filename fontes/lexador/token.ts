import { TipoToken } from "./tipo-token";

export interface Token {
    tipo: TipoToken;
    lexema: string;
    linha: number;
    coluna: number;
}
