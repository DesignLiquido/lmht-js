import { ConversorHtml } from "../conversor-html"

describe("Conversor HTML", () => {
    let conversorHtml: ConversorHtml;

    beforeEach(() => {
        conversorHtml = new ConversorHtml();
    });

    it("Vazio", async () => {
        const resultado = await conversorHtml.converterPorTexto("");
        expect(resultado).toBe("");
    });

    it("Trivial", async () => {
        const resultado = await conversorHtml.converterPorTexto("<html></html>");
        expect(resultado).toBeTruthy();
    });
});
