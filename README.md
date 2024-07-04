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

### Versão 0.5.0 ou superiores

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

Os métodos de conversão são síncronos:

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
