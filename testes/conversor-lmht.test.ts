import { ConversorLmht } from "../conversor-lmht"

describe("Conversor", () => {
    let conversorLmht: ConversorLmht;

    beforeEach(() => {
        conversorLmht = new ConversorLmht();
    });

    it("Trivial", async () => {
        const resultado = await conversorLmht.converterPorTexto("<lmht></lmht>");
        expect(resultado).toBeTruthy();
    });
});
