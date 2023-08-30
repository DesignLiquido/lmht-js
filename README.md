# lmht-js

Biblioteca de transformação de documentos [LMHT](https://github.com/DesignLiquido/LMHT) para HTML para JavaScript.

<p align="center">
    <img src="./recursos/imagens/badge-statements.svg" />
    <img src="./recursos/imagens/badge-lines.svg" />
    <img src="./recursos/imagens/badge-functions.svg" />
    <img src="./recursos/imagens/badge-branches.svg" />
</p>

## Formas de uso

### Atual, versão 0.3.0 em diante

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

Em versões anteriores, os métodos de conversão eram assíncronos.

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

## Versão 0.2.0 e `saxon-js`

Até a versão 0.2.0, usávamos a biblioteca [`saxon-js`](https://www.npmjs.com/package/saxon-js). Essa biblioteca tornou-se um problema por alguns motivos:

- Documentação incompleta e de baixa qualidade: https://www.saxonica.com/saxon-js/documentation2/index.html;
- [Apesar de ter uma licença gratuita](https://www.saxonica.com/saxon-js/documentation2/index.html#!conditions/public-license), os fontes não são abertos;
- Escrita em JavaScript puro e tipagem fraca;
- Não funciona se usada em uma extensão do Visual Studio Code, que em teoria é Node.js, mas algo acontece ao importarmos a dependência e um erro aparece.

Mantemos o suporte a versões anteriores por questões de retrocompatibilidade. A biblioteca atual usada para processamento XSLT é a [`xslt-processor`](https://github.com/DesignLiquido/xslt-processor), de código aberto e também mantida pela Design Líquido.

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
