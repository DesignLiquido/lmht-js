import { ConversorLmht } from "../conversor-lmht"

describe("Conversor LMHT", () => {
    let conversorLmht: ConversorLmht;

    beforeEach(() => {
        conversorLmht = new ConversorLmht();
    });

    it("Vazio", () => {
        const resultado = conversorLmht.converterPorTexto("");
        expect(resultado).toBe("");
    });

    it("Trivial", () => {
        const resultado = conversorLmht.converterPorTexto("<lmht></lmht>");
        expect(resultado).toBeTruthy();
    });
});
