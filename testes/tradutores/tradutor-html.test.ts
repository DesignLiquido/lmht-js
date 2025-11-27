import { AvaliadorSintaticoLmht } from "../../fontes/avaliador-sintatico/avaliador-sintatico-lmht";
import { LexadorLmht } from "../../fontes/lexador/lexador-lmht";
import { TradutorHtml } from "../../fontes/tradutores/tradutor-html";

describe('Tradutor HTML', () => {
    describe('traduzir()', () => {
        let lexador: LexadorLmht;
        let avaliador: AvaliadorSintaticoLmht;
        let tradutor: TradutorHtml;

        beforeEach(() => {
            lexador = new LexadorLmht();
            avaliador = new AvaliadorSintaticoLmht();
            tradutor = new TradutorHtml({
                formatarSaida: false, // Desabilitar formatação para testes mais simples
                incluirDocType: false,
                incluirDeclaracaoXml: false
            });
        });

        // Função auxiliar para traduzir código LMHT
        const traduzir = (codigo: string, opcoes?: any) => {
            const resultadoLexador = lexador.mapear(codigo);
            const resultadoParser = avaliador.analisar(resultadoLexador.tokens);
            
            if (opcoes) {
                const tradutorCustomizado = new TradutorHtml(opcoes);
                return tradutorCustomizado.traduzir(resultadoParser.arvore);
            }
            
            return tradutor.traduzir(resultadoParser.arvore);
        };

        describe('Tags simples', () => {
            it('Trivial - Tag raiz', () => {
                const html = traduzir('<lmht></lmht>');
                expect(html).toBe('<html></html>');
            });

            it('Trivial - Tag cabeca', () => {
                const html = traduzir('<cabeca></cabeca>');
                expect(html).toBe('<head></head>');
            });

            it('Trivial - Tag corpo', () => {
                const html = traduzir('<corpo></corpo>');
                expect(html).toBe('<body></body>');
            });

            it('Trivial - Tag paragrafo', () => {
                const html = traduzir('<p></p>');
                expect(html).toBe('<p></p>');
            });

            it('Trivial - Tag div', () => {
                const html = traduzir('<divisao></divisao>');
                expect(html).toBe('<div></div>');
            });

            it('Trivial - Tag com hífen', () => {
                const html = traduzir('<lista-simples></lista-simples>');
                expect(html).toBe('<ul></ul>');
            });
        });

        describe('Tags de formatação', () => {
            it('Trivial - Negrito', () => {
                const html = traduzir('<negrito></negrito>');
                expect(html).toBe('<strong></strong>');
            });

            it('Trivial - Itálico', () => {
                const html = traduzir('<italico></italico>');
                expect(html).toBe('<em></em>');
            });

            it('Trivial - Sublinhado', () => {
                const html = traduzir('<sublinhado></sublinhado>');
                expect(html).toBe('<u></u>');
            });

            it('Trivial - Código', () => {
                const html = traduzir('<codigo></codigo>');
                expect(html).toBe('<code></code>');
            });
        });

        describe('Tags de títulos', () => {
            it('Trivial - Título 1', () => {
                const html = traduzir('<titulo1></titulo1>');
                expect(html).toBe('<h1></h1>');
            });

            it('Trivial - Título 2', () => {
                const html = traduzir('<titulo2></titulo2>');
                expect(html).toBe('<h2></h2>');
            });

            it('Trivial - Título 3', () => {
                const html = traduzir('<titulo3></titulo3>');
                expect(html).toBe('<h3></h3>');
            });

            it('Trivial - Título 6', () => {
                const html = traduzir('<titulo6></titulo6>');
                expect(html).toBe('<h6></h6>');
            });
        });

        describe('Tags de lista', () => {
            it('Trivial - Lista simples', () => {
                const html = traduzir('<lista-simples></lista-simples>');
                expect(html).toBe('<ul></ul>');
            });

            it('Trivial - Lista ordenada', () => {
                const html = traduzir('<lista-ordenada></lista-ordenada>');
                expect(html).toBe('<ol></ol>');
            });

            it('Trivial - Item de lista', () => {
                const html = traduzir('<item-lista></item-lista>');
                expect(html).toBe('<li></li>');
            });
        });

        describe('Tags semânticas', () => {
            it('Trivial - Seção', () => {
                const html = traduzir('<secao></secao>');
                expect(html).toBe('<section></section>');
            });

            it('Trivial - Artigo', () => {
                const html = traduzir('<artigo></artigo>');
                expect(html).toBe('<article></article>');
            });

            it('Trivial - Navegação', () => {
                const html = traduzir('<navegacao></navegacao>');
                expect(html).toBe('<nav></nav>');
            });

            it('Trivial - Cabeçalho', () => {
                const html = traduzir('<cabecalho></cabecalho>');
                expect(html).toBe('<header></header>');
            });

            it('Trivial - Rodapé', () => {
                const html = traduzir('<rodape></rodape>');
                expect(html).toBe('<footer></footer>');
            });

            it('Trivial - Principal', () => {
                const html = traduzir('<principal></principal>');
                expect(html).toBe('<main></main>');
            });
        });

        describe('Tags de tabela', () => {
            it('Trivial - Tabela', () => {
                const html = traduzir('<tabela></tabela>');
                expect(html).toBe('<table></table>');
            });

            it('Trivial - Linha de tabela', () => {
                const html = traduzir('<linha-tabela></linha-tabela>');
                expect(html).toBe('<tr></tr>');
            });

            it('Trivial - Célula de cabeçalho', () => {
                const html = traduzir('<celula-cabecalho></celula-cabecalho>');
                expect(html).toBe('<th></th>');
            });

            it('Trivial - Célula de dados', () => {
                const html = traduzir('<celula-dados></celula-dados>');
                expect(html).toBe('<td></td>');
            });
        });

        describe('Tags de formulário', () => {
            it('Trivial - Formulário', () => {
                const html = traduzir('<formulario></formulario>');
                expect(html).toBe('<form></form>');
            });

            it('Trivial - Botão', () => {
                const html = traduzir('<botao></botao>');
                expect(html).toBe('<button></button>');
            });

            it('Trivial - Rótulo', () => {
                const html = traduzir('<rotulo></rotulo>');
                expect(html).toBe('<label></label>');
            });

            it('Trivial - Seleção', () => {
                const html = traduzir('<selecao></selecao>');
                expect(html).toBe('<select></select>');
            });

            it('Trivial - Opção', () => {
                const html = traduzir('<opcao></opcao>');
                expect(html).toBe('<option></option>');
            });
        });

        describe('Tags auto-fechantes', () => {
            it('Trivial - Imagem', () => {
                const html = traduzir('<imagem />');
                expect(html).toBe('<img />');
            });

            it('Trivial - Quebra de linha', () => {
                const html = traduzir('<quebra-linha />');
                expect(html).toBe('<br />');
            });

            it('Trivial - Linha horizontal', () => {
                const html = traduzir('<linha-horizontal />');
                expect(html).toBe('<hr />');
            });

            it('Trivial - Entrada de texto', () => {
                const html = traduzir('<entrada-texto />');
                expect(html).toBe('<input />');
            });
        });

        describe('Atributos simples', () => {
            it('Trivial - Classe', () => {
                const html = traduzir('<div classe="teste"></div>');
                expect(html).toBe('<div class="teste"></div>');
            });

            it('Trivial - ID', () => {
                const html = traduzir('<div id="meu-id"></div>');
                expect(html).toBe('<div id="meu-id"></div>');
            });

            it('Trivial - Estilo', () => {
                const html = traduzir('<div estilo="color: red;"></div>');
                expect(html).toBe('<div style="color: red;"></div>');
            });

            it('Trivial - Destino (href)', () => {
                const html = traduzir('<ligacao destino="/inicio"></ligacao>');
                expect(html).toBe('<a href="/inicio"></a>');
            });

            it('Trivial - Fonte (src)', () => {
                const html = traduzir('<imagem fonte="logo.png" />');
                expect(html).toBe('<img src="logo.png" />');
            });

            it('Trivial - Alt', () => {
                const html = traduzir('<imagem alt="Descrição" />');
                expect(html).toBe('<img alt="Descrição" />');
            });

            it('Trivial - Largura e altura', () => {
                const html = traduzir('<imagem largura="100" altura="200" />');
                expect(html).toBe('<img width="100" height="200" />');
            });
        });

        describe('Atributos de formulário', () => {
            it('Trivial - Tipo', () => {
                const html = traduzir('<entrada-texto tipo="email" />');
                expect(html).toBe('<input type="email" />');
            });

            it('Trivial - Nome', () => {
                const html = traduzir('<entrada-texto nome="usuario" />');
                expect(html).toBe('<input name="usuario" />');
            });

            it('Trivial - Valor', () => {
                const html = traduzir('<entrada-texto valor="texto" />');
                expect(html).toBe('<input value="texto" />');
            });

            it('Trivial - Placeholder', () => {
                const html = traduzir('<entrada-texto placeholder="Digite aqui" />');
                expect(html).toBe('<input placeholder="Digite aqui" />');
            });

            it('Trivial - Obrigatório', () => {
                const html = traduzir('<entrada-texto obrigatorio="true" />');
                expect(html).toBe('<input required="true" />');
            });

            it('Trivial - Desabilitado', () => {
                const html = traduzir('<entrada-texto desabilitado="true" />');
                expect(html).toBe('<input disabled="true" />');
            });
        });

        describe('Atributos especiais', () => {
            it('Comum - Atributos data-*', () => {
                const html = traduzir('<div dados-valor="123"></div>');
                expect(html).toBe('<div data-valor="123"></div>');
            });

            it('Comum - Atributos aria-*', () => {
                const html = traduzir('<div aria-label="Menu"></div>');
                expect(html).toBe('<div aria-label="Menu"></div>');
            });

            it('Comum - Múltiplos atributos', () => {
                const html = traduzir('<div classe="teste" id="div1" estilo="color: blue;"></div>');
                expect(html).toBe('<div class="teste" id="div1" style="color: blue;"></div>');
            });
        });

        describe('Texto e conteúdo', () => {
            it('Trivial - Texto simples', () => {
                const html = traduzir('<p>Olá mundo</p>');
                expect(html).toBe('<p>Olá mundo</p>');
            });

            it('Trivial - Texto com acentos', () => {
                const html = traduzir('<p>Olá, você está bem?</p>');
                expect(html).toBe('<p>Olá, você está bem?</p>');
            });

            it('Comum - Texto com caracteres especiais escapados', () => {
                // Nota: caracteres < e > não podem aparecer diretamente no texto LMHT
                // pois são interpretados como delimitadores de tags.
                // Para incluir esses caracteres, use entidades HTML no código LMHT.
                const html = traduzir('<p>5 &amp; 10</p>');
                expect(html).toContain('&amp;amp;'); // & é escapado para &amp;
            });

            it('Comum - Texto com múltiplas linhas', () => {
                const html = traduzir('<p>Linha 1\nLinha 2</p>');
                expect(html).toContain('Linha 1');
                expect(html).toContain('Linha 2');
            });
        });

        describe('Estruturas aninhadas', () => {
            it('Comum - Dois níveis', () => {
                const html = traduzir('<div><p>Texto</p></div>');
                expect(html).toBe('<div><p>Texto</p></div>');
            });

            it('Comum - Três níveis', () => {
                const html = traduzir('<div><secao><p>Texto</p></secao></div>');
                expect(html).toBe('<div><section><p>Texto</p></section></div>');
            });

            it('Comum - Múltiplos filhos', () => {
                const html = traduzir('<div><p>Um</p><p>Dois</p><p>Três</p></div>');
                expect(html).toContain('<p>Um</p>');
                expect(html).toContain('<p>Dois</p>');
                expect(html).toContain('<p>Três</p>');
            });

            it('Comum - Elementos misturados com texto', () => {
                const html = traduzir('<p>Texto <negrito>negrito</negrito> normal</p>');
                expect(html).toContain('<strong>negrito</strong>');
                expect(html).toContain('Texto');
                expect(html).toContain('normal');
            });
        });

        describe('Documentos completos', () => {
            it('Comum - Estrutura básica LMHT', () => {
                const codigo = `<lmht>
                    <cabeca>
                        <titulo>Teste</titulo>
                    </cabeca>
                    <corpo>
                        <p>Conteúdo</p>
                    </corpo>
                </lmht>`;
                const html = traduzir(codigo);

                expect(html).toContain('<html>');
                expect(html).toContain('<head>');
                expect(html).toContain('<title>Teste</title>');
                expect(html).toContain('<body>');
                expect(html).toContain('<p>Conteúdo</p>');
            });

            it('Comum - Lista completa', () => {
                const codigo = `<lista-simples>
                    <item-lista>Item 1</item-lista>
                    <item-lista>Item 2</item-lista>
                    <item-lista>Item 3</item-lista>
                </lista-simples>`;
                const html = traduzir(codigo);

                expect(html).toContain('<ul>');
                expect(html).toContain('<li>Item 1</li>');
                expect(html).toContain('<li>Item 2</li>');
                expect(html).toContain('<li>Item 3</li>');
                expect(html).toContain('</ul>');
            });

            it('Comum - Navegação com links', () => {
                const codigo = `<navegacao>
                    <lista-simples>
                        <item-lista><ligacao destino="/">Início</ligacao></item-lista>
                        <item-lista><ligacao destino="/sobre">Sobre</ligacao></item-lista>
                    </lista-simples>
                </navegacao>`;
                const html = traduzir(codigo);

                expect(html).toContain('<nav>');
                expect(html).toContain('<ul>');
                expect(html).toContain('<a href="/">Início</a>');
                expect(html).toContain('<a href="/sobre">Sobre</a>');
            });

            it('Comum - Tabela simples', () => {
                const codigo = `<tabela>
                    <linha-tabela>
                        <celula-cabecalho>Nome</celula-cabecalho>
                        <celula-cabecalho>Idade</celula-cabecalho>
                    </linha-tabela>
                    <linha-tabela>
                        <celula-dados>João</celula-dados>
                        <celula-dados>25</celula-dados>
                    </linha-tabela>
                </tabela>`;
                const html = traduzir(codigo);

                expect(html).toContain('<table>');
                expect(html).toContain('<th>Nome</th>');
                expect(html).toContain('<th>Idade</th>');
                expect(html).toContain('<td>João</td>');
                expect(html).toContain('<td>25</td>');
            });

            it('Comum - Formulário com campos', () => {
                const codigo = `<formulario acao="/enviar" metodo="post">
                    <rotulo para="nome">Nome:</rotulo>
                    <entrada-texto id="nome" nome="nome" tipo="text" />
                    <botao tipo="submit">Enviar</botao>
                </formulario>`;
                const html = traduzir(codigo);

                expect(html).toContain('<form action="/enviar" method="post">');
                expect(html).toContain('<label for="nome">Nome:</label>');
                expect(html).toContain('<input id="nome" name="nome" type="text" />');
                expect(html).toContain('<button type="submit">Enviar</button>');
            });
        });

        describe('Formatação de saída', () => {
            it('Comum - Sem formatação (padrão)', () => {
                const codigo = '<div><p>Texto</p></div>';
                const html = traduzir(codigo);

                expect(html).not.toContain('\n');
                expect(html).toBe('<div><p>Texto</p></div>');
            });

            it('Comum - Com formatação e identação', () => {
                const codigo = '<div><p>Texto</p></div>';
                const html = traduzir(codigo, {
                    formatarSaida: true,
                    identacao: 2
                });

                expect(html).toContain('\n');
                expect(html).toContain('  '); // Identação
            });

            it('Comum - Com DOCTYPE', () => {
                const codigo = '<lmht></lmht>';
                const html = traduzir(codigo, {
                    incluirDocType: true
                });

                expect(html).toContain('<!DOCTYPE html>');
                expect(html).toContain('<html>');
            });
        });

        describe('Escapamento de caracteres', () => {
            it('Comum - Escapar &', () => {
                const html = traduzir('<p>Teste & teste</p>');
                expect(html).toContain('&amp;');
            });

            it('Comum - Escapar < e > via CDATA ou entidades', () => {
                // Nota: < e > não podem aparecer diretamente no texto LMHT.
                // Use entidades HTML no código fonte LMHT: &lt; e &gt;
                const html = traduzir('<p>&lt; menor que e &gt; maior que</p>');
                expect(html).toContain('&amp;lt;'); // &lt; é escapado para &amp;lt;
                expect(html).toContain('&amp;gt;'); // &gt; é escapado para &amp;gt;
            });

            it('Comum - Escapar aspas em atributos', () => {
                const html = traduzir('<div titulo-elemento="Teste com aspas"></div>');
                expect(html).toContain('title="Teste com aspas"');
            });

            it('Comum - Não escapar entidades HTML existentes no código', () => {
                const html = traduzir('<p>&copy; 2024</p>');
                expect(html).toContain('&amp;copy;'); // & é escapado
            });
        });

        describe('Tags não mapeadas', () => {
            it('Comum - Tag desconhecida mantém nome original', () => {
                const html = traduzir('<tag-customizada></tag-customizada>');
                expect(html).toBe('<tag-customizada></tag-customizada>');
            });

            it('Comum - Atributo desconhecido mantém nome original', () => {
                const html = traduzir('<div atributo-customizado="valor"></div>');
                expect(html).toBe('<div atributo-customizado="valor"></div>');
            });
        });

        describe('Casos especiais', () => {
            it('Comum - Elemento vazio sem filhos', () => {
                const html = traduzir('<div></div>');
                expect(html).toBe('<div></div>');
            });

            it('Comum - Múltiplos elementos raiz (só primeiro é traduzido)', () => {
                const codigo = '<div></div>';
                const html = traduzir(codigo);
                expect(html).toBe('<div></div>');
            });

            it('Comum - Texto com espaços preservados', () => {
                // Nota: o lexer remove espaços no início e fim do texto (trimEnd)
                const html = traduzir('<p>  Texto   com   espaços  </p>');
                expect(html).toContain('Texto   com   espaços'); // Espaços internos preservados
            });

            it('Comum - Elemento com apenas texto inline', () => {
                const html = traduzir('<p>Texto inline</p>');
                expect(html).toBe('<p>Texto inline</p>');
            });
        });

        describe('Integração completa', () => {
            it('Complexo - Página completa realista', () => {
                const codigo = `<lmht>
                    <cabeca>
                        <titulo>Minha Página</titulo>
                        <meta-dados charset="UTF-8" />
                    </cabeca>
                    <corpo classe="pagina-principal">
                        <cabecalho>
                            <titulo1>Site Exemplo</titulo1>
                            <navegacao>
                                <lista-simples>
                                    <item-lista><ligacao destino="/">Início</ligacao></item-lista>
                                    <item-lista><ligacao destino="/sobre">Sobre</ligacao></item-lista>
                                </lista-simples>
                            </navegacao>
                        </cabecalho>
                        <principal>
                            <artigo>
                                <titulo2>Artigo Principal</titulo2>
                                <p>Este é um <negrito>exemplo</negrito> de artigo.</p>
                                <imagem fonte="foto.jpg" alt="Foto" largura="800" />
                            </artigo>
                        </principal>
                        <rodape>
                            <p>Copyright 2024</p>
                        </rodape>
                    </corpo>
                </lmht>`;
                
                const html = traduzir(codigo);

                // Verificar estrutura HTML
                expect(html).toContain('<html>');
                expect(html).toContain('<head>');
                expect(html).toContain('<title>Minha Página</title>');
                expect(html).toContain('<meta charset="UTF-8" />');
                expect(html).toContain('<body class="pagina-principal">');
                
                // Verificar navegação
                expect(html).toContain('<nav>');
                expect(html).toContain('<a href="/">Início</a>');
                expect(html).toContain('<a href="/sobre">Sobre</a>');
                
                // Verificar conteúdo
                expect(html).toContain('<main>');
                expect(html).toContain('<article>');
                expect(html).toContain('<strong>exemplo</strong>');
                expect(html).toContain('<img src="foto.jpg" alt="Foto" width="800" />');
                
                // Verificar rodapé
                expect(html).toContain('<footer>');
                expect(html).toContain('Copyright 2024');
            });
        });
    });
});