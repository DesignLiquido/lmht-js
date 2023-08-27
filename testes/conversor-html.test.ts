import { ConversorHtml } from "../conversor-html"

describe("Conversor HTML", () => {
    let conversorHtml: ConversorHtml;

    beforeEach(() => {
        conversorHtml = new ConversorHtml("./especificacao/lmht-reverso-xml10.xslt");
    });

    it("Vazio", () => {
        const resultado = conversorHtml.converterPorTexto("");
        expect(resultado).toBe("");
    });

    it("Trivial", () => {
        const resultado = conversorHtml.converterPorTexto("<html></html>");
        expect(resultado).toBeTruthy();
    });
});
