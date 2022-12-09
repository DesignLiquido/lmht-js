import { ConversorLmht } from "../conversor-lmht"

describe("Conversor", () => {
    let conversorLmht: ConversorLmht;

    beforeEach(() => {
        conversorLmht = new ConversorLmht();
    });

    it("Vazio", async () => {
        const resultado = await conversorLmht.converterPorTexto("");
        expect(resultado).toBe("");
    });

    it("Trivial", async () => {
        const resultado = await conversorLmht.converterPorTexto("<lmht></lmht>");
        expect(resultado).toBeTruthy();
    });
});
