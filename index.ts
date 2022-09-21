import ConversorLmht from "./conversor-lmht";

const conversorLmht = new ConversorLmht();
conversorLmht.converterPorArquivo().then(resultado => {
    console.log(resultado);
});
