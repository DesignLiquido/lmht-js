# lmht-js

Biblioteca de transformação de documentos [LMHT](https://github.com/DesignLiquido/LMHT) para HTML, para JavaScript e TypeScript.

<p align="center">
    <a href="https://github.com/DesignLiquido/lmht-js/issues" target="_blank">
        <img src="https://img.shields.io/github/issues/Designliquido/lmht-js" />
    </a>
    <img src="https://img.shields.io/github/stars/Designliquido/lmht-js" />
    <img src="https://img.shields.io/github/forks/Designliquido/lmht-js" />
    <a href="https://www.npmjs.com/package/@designliquido/lmht-js" target="_blank">
        <img src="https://img.shields.io/npm/v/@designliquido/lmht-js" />
    </a>
    <img src="https://img.shields.io/npm/dw/@designliquido/lmht-js" />
    <img src="https://img.shields.io/github/license/DesignLiquido/lmht-js" />
</p>

<p align="center">
    <img src="./recursos/imagens/badge-statements.svg" />
    <img src="./recursos/imagens/badge-lines.svg" />
    <img src="./recursos/imagens/badge-functions.svg" />
    <img src="./recursos/imagens/badge-branches.svg" />
</p>

## Formas de uso

### Versão 0.6.0 ou superiores — fluxo Lexador → Avaliador Sintático → Tradutor

A partir da versão 0.6.0 é possível usar cada etapa da pipeline de transformação diretamente, o que permite inspecionar tokens e a árvore sintática (AST) antes de gerar o HTML.

```js
import { LexadorLmht, AvaliadorSintaticoLmht, TradutorHtml } from "@designliquido/lmht-js";

const lexador = new LexadorLmht();
const avaliadorSintatico = new AvaliadorSintaticoLmht();
const tradutor = new TradutorHtml();

const codigo = `<lmht><cabeca><titulo>Teste</titulo></cabeca><corpo>Olá, mundo!</corpo></lmht>`;

// 1. Lexar: transforma o texto em tokens
const retornoLexador = lexador.mapear(codigo);

// 2. Analisar: transforma os tokens em uma árvore sintática
const retornoAvaliador = avaliadorSintatico.analisar(retornoLexador.tokens);

// 3. Traduzir: transforma a árvore sintática em HTML
const html = tradutor.traduzir(retornoAvaliador.arvore);
console.log(html);
// Resultado:
// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Teste</title>
//   </head>
//   <body>Olá, mundo!</body>
// </html>
```

O `TradutorHtml` aceita opções de formatação e também permite verificar erros de cada etapa:

```js
import { LexadorLmht, AvaliadorSintaticoLmht, TradutorHtml } from "@designliquido/lmht-js";

const tradutor = new TradutorHtml({
    identacao: 4,                // Número de espaços por nível de identação (padrão: 2)
    usarTabulacao: false,        // Usar tabulação em vez de espaços (padrão: false)
    formatarSaida: true,         // Formatar a saída com quebras de linha (padrão: true)
    preservarComentarios: true,  // Preservar comentários na saída HTML (padrão: false)
    incluirDeclaracaoXml: false, // Incluir declaração <?xml ...?> (padrão: false)
    incluirDocType: true,        // Incluir <!DOCTYPE html> (padrão: true)
});

const lexador = new LexadorLmht();
const avaliadorSintatico = new AvaliadorSintaticoLmht();

const codigo = `<lmht><cabeca><titulo>Teste</titulo></cabeca><corpo>Olá, mundo!</corpo></lmht>`;

const { tokens, erros: errosLexador } = lexador.mapear(codigo);
const { arvore, erros: errosAvaliador } = avaliadorSintatico.analisar(tokens);

if (errosLexador.length > 0 || errosAvaliador.length > 0) {
    console.error("Erros:", [...errosLexador, ...errosAvaliador]);
} else {
    console.log(tradutor.traduzir(arvore));
}
```

### Versão 0.5.0 ou superiores

Até esta versão, apenas os métodos de conversão usando transformação XSLT estavam disponíveis. Entre as opções de conversão, há `converterPorArquivo` e `converterPorTexto`, ambos para LMHT e HTML. Os métodos de conversão são assíncronos, e retornam uma `Promise` que resolve para o resultado da conversão.

#### Exemplos de LMHT para HTML

```js
import { ConversorLmht } from "@designliquido/lmht-js";

const conversorLmht = new ConversorLmht();
// Ou
const resultado = await conversorLmht.converterPorArquivo("meu-arquivo.lmht");
console.log(resultado);

// Ou
conversorLmht.converterPorArquivo("meu-arquivo.lmht").then(resultado => {
    console.log(resultado);
});
```

```js
import { ConversorLmht } from "@designliquido/lmht-js";

const conversorLmht = new ConversorLmht();
// Ou
const resultado = await conversorLmht.converterPorTexto("<lmht><cabeca><titulo>Teste</titulo></cabeca><corpo>Teste</corpo></lmht>");
console.log(resultado); // Resultado: <html><head><title>Teste</title></head><body>Teste</body></html>

// Ou
conversorLmht.converterPorTexto("<lmht><cabeca><titulo>Teste</titulo></cabeca><corpo>Teste</corpo></lmht>").then(resultado => {
    console.log(resultado); // Resultado: <html><head><title>Teste</title></head><body>Teste</body></html>
});
```

#### Exemplos de HTML para LMHT

```js
import { ConversorHtml } from "@designliquido/lmht-js";

const conversorHtml = new ConversorHtml();
// Ou
const resultado = await conversorHtml.converterPorArquivo("meu-arquivo.html");
console.log(resultado);

// Ou
conversorHtml.converterPorArquivo("meu-arquivo.html").then(resultado => {
    console.log(resultado);
});
```

```js
import { ConversorHtml } from "@designliquido/lmht-js";

const conversorHtml = new ConversorHtml();
// Ou
const resultado = await conversorHtml.converterPorTexto("<html><head><title>Teste</title></head><body>Teste</body></html>");
console.log(resultado); // Resultado: <lmht><cabeca><titulo>Teste</titulo></cabeca><corpo>Teste</corpo></lmht>

// Ou
conversorHtml.converterPorTexto("<html><head><title>Teste</title></head><body>Teste</body></html>").then(resultado => {
    console.log(resultado); // Resultado: <lmht><cabeca><titulo>Teste</titulo></cabeca><corpo>Teste</corpo></lmht>
});
```

### Versão 0.3.0 até versão 0.4.9

Os métodos de conversão são os mesmos, mas são síncronos:

```js
import { ConversorLmht } from "@designliquido/lmht-js";

const conversorLmht = new ConversorLmht();
const resultado = conversorLmht.converterPorArquivo("meu-arquivo.lmht");
console.log(resultado);
```

```js
import { ConversorLmht } from "@designliquido/lmht-js";

const conversorLmht = new ConversorLmht();
const resultado = conversorLmht.converterPorTexto("<lmht><cabeca><titulo>Teste</titulo></cabeca><corpo>Teste</corpo></lmht>");
console.log(resultado); // Resultado: <html><head><title>Teste</title></head><body>Teste</body></html>
```

```js
import { ConversorHtml } from "@designliquido/lmht-js";

const conversorHtml = new ConversorHtml();
const resultado = conversorHtml.converterPorArquivo("meu-arquivo.html");
console.log(resultado);
```

```js
import { ConversorHtml } from "@designliquido/lmht-js";

const conversorHtml = new ConversorHtml();
const resultado = conversorHtml.converterPorTexto("<html><head><title>Teste</title></head><body>Teste</body></html>");
console.log(resultado); // Resultado: <lmht><cabeca><titulo>Teste</titulo></cabeca><corpo>Teste</corpo></lmht>
```

### Até a versão 0.2.0

Os métodos de conversão são assíncronos.

```js
import { ConversorLmht } from "@designliquido/lmht-js";

const conversorLmht = new ConversorLmht();
conversorLmht.converterPorArquivo("meu-arquivo.lmht").then(resultado => {
    console.log(resultado);
});
```

```js
import { ConversorHtml } from "@designliquido/lmht-js";

const conversorHtml = new ConversorHtml();
conversorHtml.converterPorArquivo("meu-arquivo.lmht").then(resultado => {
    console.log(resultado);
});
```

## Conformidade com especificação 

`lmht-js` segue a especificação mais recente de [LMHT](https://github.com/DesignLiquido/LMHT). O projeto da especificação é referenciado aqui como um [submódulo git](https://git-scm.com/docs/git-submodule/pt_BR). Para sincronizar a especificação, use o comando:

```sh
git submodule update --init --recursive --remote
```

## Versões 0.3.0 até 0.4.9, usando `xslt-processor`, e mudanças na versão 0.5.0

Na versão 0.3.0, tomamos a decisão de mudar para a biblioteca [`xslt-processor`](https://github.com/DesignLiquido/xslt-processor), 100% em código aberto, licença MIT, e mantida pela Design Líquido. Não apenas os _bugs_ que tínhamos com a biblioteca anterior, `saxon-js`, são totalmente evitados como também a implementação de `xslt-processor` privilegia o projeto de LMHT.

Isso fez com que os métodos se tornassem síncronos. Depois da versão 3.0.0 de `xslt-processor`, em que o comando `<xsl:include>` foi implementado, o processamento de transformações XSLT passou a ser novamente assíncrono. O comando `<xsl:include>` exige um acesso a um sistema de arquivos ou um recurso na internet, o que pede para que todo o processo seja assíncrono. Para esta biblioteca, os comandos de conversão voltam a ser assíncronos na versão 0.5.0.

## Versão 0.2.0 e `saxon-js`

Até a versão 0.2.0, usávamos a biblioteca [`saxon-js`](https://www.npmjs.com/package/saxon-js). Essa biblioteca tornou-se um problema por alguns motivos:

- Documentação incompleta, em inglês e de baixa qualidade: https://www.saxonica.com/saxon-js/documentation2/index.html;
- [Apesar de ter uma licença gratuita](https://www.saxonica.com/saxon-js/documentation2/index.html#!conditions/public-license), os fontes não são abertos;
- Escrita em JavaScript puro e tipagem fraca, além de ter uma parte compilada em C;
- Não funciona se usada em uma extensão do Visual Studio Code, que em teoria é Node.js, mas algo acontece ao importarmos a dependência e um erro estranho aparece.

Mantemos o suporte a versões anteriores por questões de retrocompatibilidade. 

### Especificação e arquivos `.sef.json`

`saxon-js` pede por arquivos `.sef.json`, que podem ser gerados pelos comandos abaixo:

PowerShell:
```powershell
xslt3 -t "-xsl:especificacao/lmht.xslt" "-export:lmht.sef.json" -nogo -relocate
xslt3 -t "-xsl:especificacao/lmht-reverso-xml10.xslt" "-export:lmht-reverso-xml10.sef.json" -nogo -relocate
```

bash, zsh:
```sh
xslt3 -t -xsl:especificacao/lmht.xslt -export:lmht.sef.json -nogo -relocate
xslt3 -t -xsl:especificacao/lmht-reverso.xslt -export:lmht-reverso.sef.json -nogo -relocate
```

O arquivo XSLT da especificação ou da especificação reversa também podem ser usados, mas isso causa um atraso na carga de pelo menos 2 segundos por arquivo, que é o tempo que leva para compilar a especificação de XSLT para `.sef.json`. Para entender como isso funciona, verifique o fonte [`objeto-especificacao.ts`](https://github.com/DesignLiquido/lmht-js/blob/4260f8006a289d38f5447deac35d92e3a7d9af98/objeto-especificacao.ts). 

Assim sendo, os arquivos `.sef.json` correspondentes ao _commit_ apontado pelo submódulo são versionados neste diretório raiz, e distribuídos juntamente com o pacote NPM.

### Compatibilidade com XML

SaxonJS não trabalha com XML 1.1, e por isso a especificação com XML 1.0 é usada aqui.
