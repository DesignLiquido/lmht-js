import * as caminho from 'path';

import { ConversorLmht } from "./conversor-lmht";

export class ConversorHtml extends ConversorLmht {
    constructor(diretorioEspecificacao?: string) {
        super(diretorioEspecificacao || caminho.join(__dirname, "./especificacao/lmht-reverso-xml10.xslt"));
    }
}
