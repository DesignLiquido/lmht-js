import { LexadorLmht } from "../../fontes/lexador/lexador-lmht";
import { AvaliadorSintaticoLmht } from "../../fontes/avaliador-sintatico/avaliador-sintatico-lmht";
import { ComentarioLmht, DeclaracaoXmlLmht, DocTypeLmht, ElementoLmht, TextoLmht } from "../../fontes/construtos";

describe('Avaliador Sintático LMHT', () => {
    describe('analisar()', () => {
        let lexador: LexadorLmht;
        let avaliador: AvaliadorSintaticoLmht;

        beforeEach(() => {
            lexador = new LexadorLmht();
            avaliador = new AvaliadorSintaticoLmht();
        });

        // Função auxiliar para analisar código LMHT
        const analisar = (codigo: string) => {
            const resultadoLexador = lexador.mapear(codigo);
            return avaliador.analisar(resultadoLexador.tokens);
        };

        describe('Elementos simples', () => {
            it('Trivial - Elemento raiz vazio', () => {
                const resultado = analisar('<lmht></lmht>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz).toBeDefined();
                expect(resultado.arvore.elementoRaiz?.nome).toBe('lmht');
                expect(resultado.arvore.elementoRaiz?.filhos).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.atributos).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.autoFechante).toBe(false);
            });

            it('Trivial - Elemento auto-fechante', () => {
                const resultado = analisar('<imagem />');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz).toBeDefined();
                expect(resultado.arvore.elementoRaiz?.nome).toBe('imagem');
                expect(resultado.arvore.elementoRaiz?.autoFechante).toBe(true);
                expect(resultado.arvore.elementoRaiz?.filhos).toHaveLength(0);
            });

            it('Trivial - Elemento com texto simples', () => {
                const resultado = analisar('<p>Olá mundo</p>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz).toBeDefined();
                expect(resultado.arvore.elementoRaiz?.nome).toBe('p');
                expect(resultado.arvore.elementoRaiz?.filhos).toHaveLength(1);
                
                const filho = resultado.arvore.elementoRaiz?.filhos[0];
                expect(filho).toBeInstanceOf(TextoLmht);
                expect((filho as TextoLmht).conteudo).toBe('Olá mundo');
            });

            it('Trivial - Elemento com nome com hífen', () => {
                const resultado = analisar('<lista-simples></lista-simples>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('lista-simples');
            });

            it('Trivial - Elemento com nome acentuado', () => {
                const resultado = analisar('<vídeo></vídeo>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('vídeo');
            });
        });

        describe('Atributos', () => {
            it('Trivial - Elemento com um atributo', () => {
                const resultado = analisar('<p classe="teste"></p>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.atributos).toHaveLength(1);
                expect(resultado.arvore.elementoRaiz?.atributos[0].nome).toBe('classe');
                expect(resultado.arvore.elementoRaiz?.atributos[0].valor).toBe('teste');
            });

            it('Trivial - Elemento com múltiplos atributos', () => {
                const resultado = analisar('<imagem fonte="logo.png" alt="Logo" largura="100" />');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.atributos).toHaveLength(3);
                
                const atributos = resultado.arvore.elementoRaiz?.atributos || [];
                expect(atributos[0].nome).toBe('fonte');
                expect(atributos[0].valor).toBe('logo.png');
                expect(atributos[1].nome).toBe('alt');
                expect(atributos[1].valor).toBe('Logo');
                expect(atributos[2].nome).toBe('largura');
                expect(atributos[2].valor).toBe('100');
            });

            it('Trivial - Atributo com valor complexo', () => {
                const resultado = analisar('<ligacao destino="https://exemplo.com?param=valor&outro=2"></ligacao>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.atributos[0].valor).toBe('https://exemplo.com?param=valor&outro=2');
            });

            it('Trivial - Atributo com caracteres especiais', () => {
                const resultado = analisar('<div estilo="color: #fff; margin: 10px;"></div>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.atributos[0].valor).toBe('color: #fff; margin: 10px;');
            });
        });

        describe('Elementos aninhados', () => {
            it('Trivial - Dois níveis de aninhamento', () => {
                const resultado = analisar('<div><p>Texto</p></div>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('div');
                expect(resultado.arvore.elementoRaiz?.filhos).toHaveLength(1);
                
                const filho = resultado.arvore.elementoRaiz?.filhos[0];
                expect(filho).toBeInstanceOf(ElementoLmht);
                expect((filho as ElementoLmht).nome).toBe('p');
                expect((filho as ElementoLmht).filhos).toHaveLength(1);
                
                const textoFilho = (filho as ElementoLmht).filhos[0];
                expect(textoFilho).toBeInstanceOf(TextoLmht);
                expect((textoFilho as TextoLmht).conteudo).toBe('Texto');
            });

            it('Comum - Múltiplos níveis de aninhamento', () => {
                const resultado = analisar('<a><b><c><d>Conteúdo</d></c></b></a>');

                expect(resultado.erros).toHaveLength(0);
                
                let elementoAtual = resultado.arvore.elementoRaiz;
                expect(elementoAtual?.nome).toBe('a');
                
                elementoAtual = elementoAtual?.filhos[0] as ElementoLmht;
                expect(elementoAtual?.nome).toBe('b');
                
                elementoAtual = elementoAtual?.filhos[0] as ElementoLmht;
                expect(elementoAtual?.nome).toBe('c');
                
                elementoAtual = elementoAtual?.filhos[0] as ElementoLmht;
                expect(elementoAtual?.nome).toBe('d');
                
                const texto = elementoAtual?.filhos[0] as TextoLmht;
                expect(texto.conteudo).toBe('Conteúdo');
            });

            it('Comum - Múltiplos filhos no mesmo nível', () => {
                const resultado = analisar(`
                    <lista-simples>
                        <item-lista>Item 1</item-lista>
                        <item-lista>Item 2</item-lista>
                        <item-lista>Item 3</item-lista>
                    </lista-simples>
                `);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('lista-simples');
                
                // Filtrar apenas elementos (não texto com espaços)
                const filhosElementos = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) || [];
                
                expect(filhosElementos).toHaveLength(3);
                filhosElementos.forEach((filho, index) => {
                    expect((filho as ElementoLmht).nome).toBe('item-lista');
                    const textoFilho = (filho as ElementoLmht).filhos[0] as TextoLmht;
                    expect(textoFilho.conteudo).toBe(`Item ${index + 1}`);
                });
            });

            it('Comum - Elementos misturados com texto', () => {
                const resultado = analisar('<p>Texto antes <negrito>negrito</negrito> texto depois</p>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.filhos).toHaveLength(3);
                
                const filhos = resultado.arvore.elementoRaiz?.filhos || [];
                expect(filhos[0]).toBeInstanceOf(TextoLmht);
                expect((filhos[0] as TextoLmht).conteudo).toBe('Texto antes');
                
                expect(filhos[1]).toBeInstanceOf(ElementoLmht);
                expect((filhos[1] as ElementoLmht).nome).toBe('negrito');
                
                expect(filhos[2]).toBeInstanceOf(TextoLmht);
                expect((filhos[2] as TextoLmht).conteudo).toBe('texto depois');
            });
        });

        describe('Declarações e metadados', () => {
            it('Trivial - Declaração XML', () => {
                const resultado = analisar('<?xml version="1.0" encoding="UTF-8"?><lmht></lmht>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.declaracaoXml).toBeDefined();
                expect(resultado.arvore.declaracaoXml).toBeInstanceOf(DeclaracaoXmlLmht);
                expect(resultado.arvore.declaracaoXml?.conteudo).toContain('<?xml');
            });

            it('Trivial - DOCTYPE', () => {
                const resultado = analisar('<!DOCTYPE lmht><lmht></lmht>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.docType).toBeDefined();
                expect(resultado.arvore.docType).toBeInstanceOf(DocTypeLmht);
                expect(resultado.arvore.docType?.conteudo).toContain('DOCTYPE');
            });

            it('Comum - Declaração XML e DOCTYPE', () => {
                const resultado = analisar(`
                    <?xml version="1.0"?>
                    <!DOCTYPE lmht>
                    <lmht></lmht>
                `);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.declaracaoXml).toBeDefined();
                expect(resultado.arvore.docType).toBeDefined();
                expect(resultado.arvore.elementoRaiz).toBeDefined();
            });

            it('Comum - Comentários no documento', () => {
                const resultado = analisar(`
                    <!-- Comentário antes -->
                    <!DOCTYPE lmht>
                    <!-- Comentário depois -->
                    <lmht></lmht>
                `);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.comentarios.length).toBeGreaterThanOrEqual(1);
                expect(resultado.arvore.comentarios[0]).toBeInstanceOf(ComentarioLmht);
            });
        });

        describe('Documentos completos', () => {
            it('Comum - Documento LMHT básico', () => {
                const codigo = `
                    <lmht>
                        <cabeca>
                            <titulo>Teste</titulo>
                        </cabeca>
                        <corpo>
                            <p>Conteúdo</p>
                        </corpo>
                    </lmht>
                `;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('lmht');
                
                // Filtrar elementos (ignorar texto com espaços)
                const filhosLmht = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) as ElementoLmht[];
                
                expect(filhosLmht).toHaveLength(2);
                expect(filhosLmht[0].nome).toBe('cabeca');
                expect(filhosLmht[1].nome).toBe('corpo');
            });

            it('Comum - Documento com estrutura completa', () => {
                const codigo = `
                    <?xml version="1.0"?>
                    <!DOCTYPE lmht>
                    <lmht>
                        <cabeca>
                            <titulo>Página de Teste</titulo>
                        </cabeca>
                        <corpo classe="principal">
                            <titulo1>Bem-vindo</titulo1>
                            <p id="intro">Texto de introdução</p>
                            <lista-simples>
                                <item-lista>Item A</item-lista>
                                <item-lista>Item B</item-lista>
                            </lista-simples>
                        </corpo>
                    </lmht>
                `;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.declaracaoXml).toBeDefined();
                expect(resultado.arvore.docType).toBeDefined();
                expect(resultado.arvore.elementoRaiz?.nome).toBe('lmht');
                
                const filhosLmht = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) as ElementoLmht[];
                
                const corpo = filhosLmht.find(f => f.nome === 'corpo');
                expect(corpo).toBeDefined();
                expect(corpo?.atributos).toHaveLength(1);
                expect(corpo?.atributos[0].nome).toBe('classe');
                expect(corpo?.atributos[0].valor).toBe('principal');
            });

            it('Comum - Formulário com campos', () => {
                const codigo = `
                    <formulario acao="/enviar" metodo="post">
                        <rotulo para="nome">Nome:</rotulo>
                        <entrada-texto id="nome" nome="nome" />
                        <rotulo para="email">Email:</rotulo>
                        <entrada-texto id="email" nome="email" tipo="email" />
                        <botao tipo="submit">Enviar</botao>
                    </formulario>
                `;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('formulario');
                expect(resultado.arvore.elementoRaiz?.atributos).toHaveLength(2);
                
                const filhos = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) as ElementoLmht[];
                
                expect(filhos.length).toBeGreaterThanOrEqual(4);
                
                const entradasTexto = filhos.filter(f => f.nome === 'entrada-texto');
                expect(entradasTexto).toHaveLength(2);
                expect(entradasTexto[0].autoFechante).toBe(true);
                expect(entradasTexto[1].autoFechante).toBe(true);
            });

            it('Comum - Tabela com dados', () => {
                const codigo = `
                    <tabela>
                        <linha-tabela>
                            <celula-cabecalho>Nome</celula-cabecalho>
                            <celula-cabecalho>Idade</celula-cabecalho>
                        </linha-tabela>
                        <linha-tabela>
                            <celula-dados>João</celula-dados>
                            <celula-dados>25</celula-dados>
                        </linha-tabela>
                    </tabela>
                `;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('tabela');
                
                const linhas = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) as ElementoLmht[];
                
                expect(linhas).toHaveLength(2);
                expect(linhas[0].nome).toBe('linha-tabela');
                expect(linhas[1].nome).toBe('linha-tabela');
            });
        });

        describe('Validação de estrutura', () => {
            it('Erro - Tag de fechamento não correspondente', () => {
                const resultado = analisar('<div><p>Texto</div></p>');

                expect(resultado.erros.length).toBeGreaterThan(0);
                expect(resultado.erros[0]).toContain('não corresponde');
            });

            it('Erro - Tag de fechamento faltando', () => {
                const resultado = analisar('<div><p>Texto</p>');

                expect(resultado.erros.length).toBeGreaterThan(0);
            });

            it('Erro - Atributo sem valor', () => {
                const resultado = analisar('<p classe>Texto</p>');

                expect(resultado.erros.length).toBeGreaterThan(0);
            });

            it('Erro - Tag vazia sem nome', () => {
                const resultado = analisar('<>Texto</>');

                expect(resultado.erros.length).toBeGreaterThan(0);
            });
        });

        describe('Casos especiais', () => {
            it('Trivial - Texto com espaços múltiplos', () => {
                const resultado = analisar('<p>Texto   com    espaços</p>');

                expect(resultado.erros).toHaveLength(0);
                const texto = resultado.arvore.elementoRaiz?.filhos[0] as TextoLmht;
                expect(texto.conteudo).toBe('Texto   com    espaços');
            });

            it('Trivial - Texto com quebras de linha', () => {
                const resultado = analisar(`<p>Linha 1
Linha 2
Linha 3</p>`);

                expect(resultado.erros).toHaveLength(0);
                const texto = resultado.arvore.elementoRaiz?.filhos[0] as TextoLmht;
                expect(texto.conteudo).toContain('Linha 1');
                expect(texto.conteudo).toContain('Linha 2');
            });

            it('Comum - Elementos vazios múltiplos', () => {
                const resultado = analisar(`
                    <div>
                        <quebra-linha />
                        <linha-horizontal />
                        <quebra-linha />
                    </div>
                `);

                expect(resultado.erros).toHaveLength(0);
                
                const filhos = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) as ElementoLmht[];
                
                expect(filhos).toHaveLength(3);
                filhos.forEach(filho => {
                    expect(filho.autoFechante).toBe(true);
                });
            });

            it('Comum - Atributos sem espaços', () => {
                const resultado = analisar('<img fonte="a.png"alt="b"largura="10"/>');

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.atributos).toHaveLength(3);
            });

            it('Comum - Elementos com mesmo nome aninhados', () => {
                const resultado = analisar('<div><div><div>Profundo</div></div></div>');

                expect(resultado.erros).toHaveLength(0);
                
                let nivel = resultado.arvore.elementoRaiz;
                expect(nivel?.nome).toBe('div');
                
                nivel = (nivel?.filhos[0] as ElementoLmht);
                expect(nivel?.nome).toBe('div');
                
                nivel = (nivel?.filhos[0] as ElementoLmht);
                expect(nivel?.nome).toBe('div');
                
                const texto = nivel?.filhos[0] as TextoLmht;
                expect(texto.conteudo).toBe('Profundo');
            });
        });

        describe('Tags LMHT específicas', () => {
            it('Comum - Estrutura de cabeçalho', () => {
                const codigo = `
                    <cabeca>
                        <titulo>Título da Página</titulo>
                        <meta-dados charset="UTF-8" />
                        <estilo>corpo { cor: azul; }</estilo>
                    </cabeca>
                `;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('cabeca');
                
                const filhos = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) as ElementoLmht[];
                
                expect(filhos.some(f => f.nome === 'titulo')).toBe(true);
                expect(filhos.some(f => f.nome === 'meta-dados')).toBe(true);
                expect(filhos.some(f => f.nome === 'estilo')).toBe(true);
            });

            it('Comum - Elementos de formatação de texto', () => {
                const codigo = `
                    <p>
                        Texto <negrito>negrito</negrito> e 
                        <italico>itálico</italico> e 
                        <sublinhado>sublinhado</sublinhado>
                    </p>
                `;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                
                const elementosFilhos = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) as ElementoLmht[];
                
                expect(elementosFilhos.some(f => f.nome === 'negrito')).toBe(true);
                expect(elementosFilhos.some(f => f.nome === 'italico')).toBe(true);
                expect(elementosFilhos.some(f => f.nome === 'sublinhado')).toBe(true);
            });

            it('Comum - Estrutura de navegação', () => {
                const codigo = `
                    <navegacao>
                        <lista-simples>
                            <item-lista><ligacao destino="/">Início</ligacao></item-lista>
                            <item-lista><ligacao destino="/sobre">Sobre</ligacao></item-lista>
                            <item-lista><ligacao destino="/contato">Contato</ligacao></item-lista>
                        </lista-simples>
                    </navegacao>
                `;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.nome).toBe('navegacao');
                
                // Verificar estrutura de lista
                const lista = (resultado.arvore.elementoRaiz?.filhos.find(
                    f => f instanceof ElementoLmht && f.nome === 'lista-simples'
                ) as ElementoLmht);
                
                expect(lista).toBeDefined();
                
                const itens = lista.filhos.filter(
                    f => f instanceof ElementoLmht && f.nome === 'item-lista'
                ) as ElementoLmht[];
                
                expect(itens).toHaveLength(3);
            });

            it('Comum - Mídia incorporada', () => {
                const codigo = `
                    <corpo>
                        <imagem fonte="foto.jpg" alt="Descrição" largura="800" altura="600" />
                        <video fonte="video.mp4" controles="sim" largura="640" altura="480">
                            Seu navegador não suporta vídeo.
                        </video>
                        <audio fonte="musica.mp3" controles="sim">
                            Seu navegador não suporta áudio.
                        </audio>
                    </corpo>
                `;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                
                const filhos = resultado.arvore.elementoRaiz?.filhos.filter(
                    f => f instanceof ElementoLmht
                ) as ElementoLmht[];
                
                const imagem = filhos.find(f => f.nome === 'imagem');
                expect(imagem).toBeDefined();
                expect(imagem?.autoFechante).toBe(true);
                expect(imagem?.atributos).toHaveLength(4);
                
                const video = filhos.find(f => f.nome === 'video');
                expect(video).toBeDefined();
                expect(video?.autoFechante).toBe(false);
            });
        });

        describe('Rastreamento de posição', () => {
            it('Trivial - Elementos mantém linha e coluna', () => {
                const codigo = `<lmht>
    <corpo>
    </corpo>
</lmht>`;
                const resultado = analisar(codigo);

                expect(resultado.erros).toHaveLength(0);
                expect(resultado.arvore.elementoRaiz?.linha).toBe(1);
                
                const corpo = resultado.arvore.elementoRaiz?.filhos.find(
                    f => f instanceof ElementoLmht && f.nome === 'corpo'
                ) as ElementoLmht;
                
                expect(corpo).toBeDefined();
                expect(corpo.linha).toBe(2);
            });

            it('Trivial - Atributos mantém posição', () => {
                const resultado = analisar('<p classe="teste" id="paragrafo">Texto</p>');

                expect(resultado.erros).toHaveLength(0);
                
                const atributos = resultado.arvore.elementoRaiz?.atributos || [];
                expect(atributos[0].linha).toBeDefined();
                expect(atributos[0].coluna).toBeDefined();
            });
        });
    });
});
