# lmht-js

Biblioteca de transformação de documentos [LMHT](https://github.com/DesignLiquido/LMHT) para HTML para JavaScript.

## Conformidade com especificação 

`lmht-js` segue a especificação mais recente de LMHT. O projeto da especificação é referenciado aqui como um [submódulo git](https://git-scm.com/docs/git-submodule/pt_BR). Para sincronizar a especificação, use o comando:

```sh
git submodule update --init --recursive --remote
```

No entanto, a biblioteca [`SaxonJS`](https://www.npmjs.com/package/saxon-js), dependência direta de `lmht-js`, pede por arquivos `.sef.json`, que podem ser gerados pelos comandos abaixo:

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

O arquivo XSLT da especificação ou da especificação reversa também podem ser usados, mas isso causa um atraso na carga de pelo menos 2 segundos por arquivo, que é o tempo que leva para compilar a especificação de XSLT para `.sef.json`. Para entender como isso funciona, verifique o fonte `objeto-especificacao.ts`. 

Assim sendo, os arquivos `.sef.json` correspondentes ao _commit_ apontado pelo submódulo são versionados neste diretório raiz, e distribuídos juntamente com o pacote NPM.

### Compatibilidade com XML

SaxonJS não trabalha com XML 1.1, e por isso a especificação com XML 1.0 é usada aqui.

## Formas de uso

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
