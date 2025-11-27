import { Token } from "./token";

export interface RetornoLexador {
    tokens: Token[];
    erros: string[];
}
