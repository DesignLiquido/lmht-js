import { ConversorHtml } from "../conversor-html"

describe("Conversor HTML", () => {
    let conversorHtml: ConversorHtml;

    beforeEach(() => {
        conversorHtml = new ConversorHtml();
    });

    it("Vazio", () => {
        const resultado = conversorHtml.converterPorTexto("");
        expect(resultado).toBe("");
    });

    it("Trivial", () => {
        const resultado = conversorHtml.converterPorTexto("<html></html>");
        expect(resultado).toBeTruthy();
    });

    it("Cabeça e corpo", () => {
        const html = `<html>
        <head>
            <title>About - Simple Blog Template</title>
            <link href="css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <p class="anything">This is a paragraph with a class</p>
        </body>
        </html>`;
        const resultado = conversorHtml.converterPorTexto(html);
        expect(resultado).toBe(`<lmht><cabeça><título>About - Simple Blog Template</título><recurso destino="css/bootstrap.min.css" tipo="stylesheet"/></cabeça></lmht>`);
    });
});
