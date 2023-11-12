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
        const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta name="description" content="LMHT">
            <meta name="keywords" content="HTML, LMHT, Desenvolvimento, Web">
            <meta name="author" content="Leonel Sanches da Silva">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>About - Simple Blog Template</title>
            <link href="css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <p class="anything">This is a paragraph with a class</p>
        </body>
        </html>`;

        const resultadoEsperadoLmht = `<lmht>`+
            `<cabeça>`+
                `<meta nome=\"description\" conteúdo=\"LMHT\"/>`+
                `<meta nome=\"keywords\" conteúdo=\"HTML, LMHT, Desenvolvimento, Web\"/>`+
                `<meta nome=\"author\" conteúdo=\"Leonel Sanches da Silva\"/>`+
                `<meta nome=\"viewport\" conteúdo=\"width=device-width, initial-scale=1.0\"/>`+
                `<título>About - Simple Blog Template</título>`+
                `<recurso destino=\"css/bootstrap.min.css\" tipo=\"stylesheet\"/>`+
            `</cabeça>`+
            `<corpo>`+
                `<parágrafo classe=\"anything\">This is a paragraph with a class</parágrafo>`+
            `</corpo>`+
            `</lmht>`;
            
        const resultado = conversorHtml.converterPorTexto(html);
        expect(resultado).toBe(resultadoEsperadoLmht);
    });
});
