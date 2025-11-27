import { AvaliadorSintaticoLmht } from "../../fontes/avaliador-sintatico/avaliador-sintatico-lmht";
import { LexadorLmht } from "../../fontes/lexador/lexador-lmht";
import { FormatadorLmht } from "../../fontes/formatadores/formatador-lmht";


describe('Formatador LMHT', () => {
    describe('formatar()', () => {
        let lexador: LexadorLmht;
        let avaliador: AvaliadorSintaticoLmht;

        beforeEach(() => {
            lexador = new LexadorLmht();
            avaliador = new AvaliadorSintaticoLmht();
        });

        // Função auxiliar para formatar código LMHT
        const formatar = (codigo: string, opcoes?: any) => {
            const resultadoLexador = lexador.mapear(codigo);
            const resultadoParser = avaliador.analisar(resultadoLexador.tokens);
            const formatador = new FormatadorLmht(opcoes);
            return formatador.formatar(resultadoParser.arvore);
        };

        describe('Formatação básica', () => {
            it('Trivial - Tag simples sem filhos', () => {
                const codigo = '<lmht></lmht>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<lmht>');
                expect(resultado).toContain('</lmht>');
            });

            it('Trivial - Tag auto-fechante', () => {
                const codigo = '<imagem />';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<imagem />');
            });

            it('Trivial - Tag com texto inline', () => {
                const codigo = '<p>Olá mundo</p>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<p>Olá mundo</p>');
            });

            it('Comum - Tags aninhadas simples', () => {
                const codigo = '<div><p>Texto</p></div>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<div>');
                expect(resultado).toContain('    <p>Texto</p>');
                expect(resultado).toContain('</div>');
            });

            it('Comum - Múltiplos filhos', () => {
                const codigo = '<div><p>Um</p><p>Dois</p></div>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<div>');
                expect(resultado).toContain('    <p>Um</p>');
                expect(resultado).toContain('    <p>Dois</p>');
                expect(resultado).toContain('</div>');
            });
        });

        describe('Indentação', () => {
            it('Trivial - Indentação padrão (4 espaços)', () => {
                const codigo = '<div><p>Texto</p></div>';
                const resultado = formatar(codigo, { tamanhoIdentacao: 4 });

                const linhas = resultado.split('\n');
                expect(linhas[1]).toMatch(/^    <p>/); // 4 espaços
            });

            it('Trivial - Indentação com 2 espaços', () => {
                const codigo = '<div><p>Texto</p></div>';
                const resultado = formatar(codigo, { tamanhoIdentacao: 2 });

                const linhas = resultado.split('\n');
                expect(linhas[1]).toMatch(/^  <p>/); // 2 espaços
            });

            it('Trivial - Indentação com tabulação', () => {
                const codigo = '<div><p>Texto</p></div>';
                const resultado = formatar(codigo, { 
                    usarTabulacao: true,
                    tamanhoIdentacao: 1 
                });

                const linhas = resultado.split('\n');
                expect(linhas[1]).toMatch(/^\t<p>/); // 1 tab
            });

            it('Comum - Múltiplos níveis de indentação', () => {
                const codigo = '<a><b><c>Texto</c></b></a>';
                const resultado = formatar(codigo, { tamanhoIdentacao: 2 });

                const linhas = resultado.split('\n');
                expect(linhas[0]).toBe('<a>');
                expect(linhas[1]).toMatch(/^  <b>/);
                expect(linhas[2]).toMatch(/^    <c>Texto<\/c>/); // Texto inline fica na mesma linha
                expect(linhas[3]).toMatch(/^  <\/b>/);
                expect(linhas[4]).toBe('</a>');
            });
        });

        describe('Atributos', () => {
            it('Trivial - Atributo único', () => {
                const codigo = '<div classe="teste"></div>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('classe="teste"');
            });

            it('Trivial - Múltiplos atributos em linha', () => {
                const codigo = '<img fonte="logo.png" alt="Logo" />';
                const resultado = formatar(codigo, { quebrarAtributosEmLinhas: false });

                expect(resultado).toContain('fonte="logo.png"');
                expect(resultado).toContain('alt="Logo"');
                expect(resultado).toContain('<img fonte="logo.png" alt="Logo" />');
            });

            it('Comum - Aspas simples', () => {
                const codigo = '<div classe="teste"></div>';
                const resultado = formatar(codigo, { aspasAtributos: 'simples' });

                expect(resultado).toContain("classe='teste'");
            });

            it('Comum - Aspas duplas (padrão)', () => {
                const codigo = '<div classe="teste"></div>';
                const resultado = formatar(codigo, { aspasAtributos: 'duplas' });

                expect(resultado).toContain('classe="teste"');
            });

            it('Comum - Atributos quebrados em múltiplas linhas', () => {
                const codigo = '<imagem fonte="foto.jpg" alt="Foto" largura="800" />';
                const resultado = formatar(codigo, { 
                    quebrarAtributosEmLinhas: true,
                    tamanhoIdentacao: 2
                });

                expect(resultado).toContain('<imagem');
                expect(resultado).toContain('  fonte="foto.jpg"');
                expect(resultado).toContain('  alt="Foto"');
                expect(resultado).toContain('  largura="800" />');
            });

            it('Comum - Ordenar atributos alfabeticamente', () => {
                const codigo = '<div id="teste" classe="principal" estilo="color:red"></div>';
                const resultado = formatar(codigo, { ordenarAtributos: true });

                // Verificar que 'classe' vem antes de 'estilo' e 'id'
                const posClasse = resultado.indexOf('classe=');
                const posEstilo = resultado.indexOf('estilo=');
                const posId = resultado.indexOf('id=');

                expect(posClasse).toBeLessThan(posEstilo);
                expect(posEstilo).toBeLessThan(posId);
            });

            it('Comum - Não ordenar atributos (padrão)', () => {
                const codigo = '<div id="teste" classe="principal"></div>';
                const resultado = formatar(codigo, { ordenarAtributos: false });

                // Verificar que a ordem original é preservada
                const posId = resultado.indexOf('id=');
                const posClasse = resultado.indexOf('classe=');

                expect(posId).toBeLessThan(posClasse);
            });
        });

        describe('Espaçamento em tags auto-fechantes', () => {
            it('Trivial - Com espaço antes de />', () => {
                const codigo = '<imagem/>';
                const resultado = formatar(codigo, { espacoAntesAutoFechante: true });

                expect(resultado).toContain('<imagem />');
            });

            it('Trivial - Sem espaço antes de />', () => {
                const codigo = '<imagem />';
                const resultado = formatar(codigo, { espacoAntesAutoFechante: false });

                expect(resultado).toContain('<imagem/>');
            });
        });

        describe('Texto e conteúdo', () => {
            it('Trivial - Texto inline simples', () => {
                const codigo = '<p>Texto simples</p>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<p>Texto simples</p>');
            });

            it('Comum - Texto inline com espaços extras removidos', () => {
                const codigo = '<p>Texto   com    espaços</p>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<p>Texto com espaços</p>');
            });

            it('Comum - Texto com elementos aninhados', () => {
                const codigo = '<p>Texto <negrito>negrito</negrito> normal</p>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<p>');
                expect(resultado).toContain('Texto');
                expect(resultado).toContain('<negrito>negrito</negrito>');
                expect(resultado).toContain('normal');
            });

            it('Comum - Elementos sem conteúdo', () => {
                const codigo = '<div><p></p></div>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<div>');
                expect(resultado).toContain('    <p></p>'); // Elemento vazio em linha única
                expect(resultado).toContain('</div>');
            });
        });

        describe('Estruturas complexas', () => {
            it('Comum - Lista simples', () => {
                const codigo = '<lista-simples><item-lista>Item 1</item-lista><item-lista>Item 2</item-lista></lista-simples>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<lista-simples>');
                expect(resultado).toContain('    <item-lista>Item 1</item-lista>');
                expect(resultado).toContain('    <item-lista>Item 2</item-lista>');
                expect(resultado).toContain('</lista-simples>');
            });

            it('Comum - Tabela simples', () => {
                const codigo = '<tabela><linha-tabela><celula-dados>A</celula-dados></linha-tabela></tabela>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<tabela>');
                expect(resultado).toContain('    <linha-tabela>');
                expect(resultado).toContain('        <celula-dados>A</celula-dados>');
                expect(resultado).toContain('    </linha-tabela>');
                expect(resultado).toContain('</tabela>');
            });

            it('Comum - Navegação com lista', () => {
                const codigo = '<navegacao><lista-simples><item-lista><ligacao destino="/">Início</ligacao></item-lista></lista-simples></navegacao>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<navegacao>');
                expect(resultado).toContain('    <lista-simples>');
                expect(resultado).toContain('        <item-lista>');
                expect(resultado).toContain('            <ligacao destino="/">Início</ligacao>');
            });
        });

        describe('Documento completo', () => {
            it('Comum - Estrutura LMHT básica', () => {
                const codigo = '<lmht><cabeca><titulo>Teste</titulo></cabeca><corpo><p>Conteúdo</p></corpo></lmht>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<lmht>');
                expect(resultado).toContain('    <cabeca>');
                expect(resultado).toContain('        <titulo>Teste</titulo>');
                expect(resultado).toContain('    </cabeca>');
                expect(resultado).toContain('    <corpo>');
                expect(resultado).toContain('        <p>Conteúdo</p>');
                expect(resultado).toContain('    </corpo>');
                expect(resultado).toContain('</lmht>');
            });

            it('Comum - Documento com declaração XML', () => {
                const codigo = '<?xml version="1.0"?><lmht></lmht>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<?xml version="1.0"?>');
                expect(resultado).toContain('<lmht>');
            });

            it('Comum - Documento com DOCTYPE', () => {
                const codigo = '<!DOCTYPE lmht><lmht></lmht>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<!DOCTYPE lmht>');
                expect(resultado).toContain('<lmht>');
            });

            it('Comum - Documento completo com metadados', () => {
                const codigo = '<?xml version="1.0"?><!DOCTYPE lmht><lmht><cabeca><titulo>Página</titulo></cabeca><corpo><p>Teste</p></corpo></lmht>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<?xml version="1.0"?>');
                expect(resultado).toContain('<!DOCTYPE lmht>');
                expect(resultado).toContain('<lmht>');
                expect(resultado).toContain('    <cabeca>');
            });
        });

        describe('Comentários', () => {
            it('Trivial - Comentário simples preservado', () => {
                const codigo = '<!-- Comentário --><!DOCTYPE lmht><lmht></lmht>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<!-- Comentário -->');
            });

            it('Comum - Múltiplos comentários', () => {
                const codigo = '<!-- Comentário 1 --><!-- Comentário 2 --><lmht></lmht>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<!-- Comentário 1 -->');
                expect(resultado).toContain('<!-- Comentário 2 -->');
            });
        });

        describe('Quebras de linha', () => {
            it('Trivial - Quebras de linha Unix (\\n)', () => {
                const codigo = '<div><p>Texto</p></div>';
                const resultado = formatar(codigo, { quebraLinha: '\n' });

                expect(resultado.includes('\n')).toBe(true);
                expect(resultado.includes('\r\n')).toBe(false);
            });

            it('Trivial - Quebras de linha Windows (\\r\\n)', () => {
                const codigo = '<div><p>Texto</p></div>';
                const resultado = formatar(codigo, { quebraLinha: '\r\n' });

                expect(resultado.includes('\r\n')).toBe(true);
            });
        });

        describe('Casos especiais', () => {
            it('Comum - Código já bem formatado deve permanecer consistente', () => {
                const codigo = `<lmht>
    <corpo>
        <p>Texto</p>
    </corpo>
</lmht>`;
                const resultado = formatar(codigo);

                // Verificar estrutura básica mantida
                expect(resultado).toContain('<lmht>');
                expect(resultado).toContain('    <corpo>');
                expect(resultado).toContain('        <p>Texto</p>');
            });

            it('Comum - Código mal formatado em uma linha', () => {
                const codigo = '<lmht><cabeca><titulo>T</titulo></cabeca><corpo><p>C</p></corpo></lmht>';
                const resultado = formatar(codigo);

                // Deve adicionar quebras de linha e indentação
                const linhas = resultado.split('\n');
                expect(linhas.length).toBeGreaterThan(5);
            });

            it('Comum - Elementos vazios misturados', () => {
                const codigo = '<div><quebra-linha /><p>Texto</p><linha-horizontal /></div>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<quebra-linha />');
                expect(resultado).toContain('<p>Texto</p>');
                expect(resultado).toContain('<linha-horizontal />');
            });

            it('Comum - Tags com hífen no nome', () => {
                const codigo = '<lista-simples><item-lista>Item</item-lista></lista-simples>';
                const resultado = formatar(codigo);

                expect(resultado).toContain('<lista-simples>');
                expect(resultado).toContain('<item-lista>Item</item-lista>');
                expect(resultado).toContain('</lista-simples>');
            });
        });

        describe('Integração completa', () => {
            it('Complexo - Página completa realista mal formatada', () => {
                const codigo = '<lmht><cabeca><titulo>Minha Página</titulo><meta-dados charset="UTF-8" /></cabeca><corpo classe="principal" id="corpo-1"><cabecalho><titulo1>Site Exemplo</titulo1></cabecalho><navegacao><lista-simples><item-lista><ligacao destino="/">Início</ligacao></item-lista><item-lista><ligacao destino="/sobre">Sobre</ligacao></item-lista></lista-simples></navegacao><principal><artigo><titulo2>Artigo</titulo2><p>Este é um <negrito>exemplo</negrito> de texto.</p></artigo></principal><rodape><p>Copyright 2024</p></rodape></corpo></lmht>';
                
                const resultado = formatar(codigo, {
                    tamanhoIdentacao: 4,
                    aspasAtributos: 'duplas',
                    ordenarAtributos: false
                });

                // Verificar estrutura geral
                expect(resultado).toContain('<lmht>');
                expect(resultado).toContain('    <cabeca>');
                expect(resultado).toContain('        <titulo>Minha Página</titulo>');
                expect(resultado).toContain('        <meta-dados charset="UTF-8" />');
                
                // Verificar navegação
                expect(resultado).toContain('    <navegacao>');
                expect(resultado).toContain('        <lista-simples>');
                expect(resultado).toContain('            <item-lista>');
                
                // Verificar conteúdo
                expect(resultado).toContain('    <principal>');
                expect(resultado).toContain('        <artigo>');
                
                // Verificar rodapé
                expect(resultado).toContain('    <rodape>');
                expect(resultado).toContain('        <p>Copyright 2024</p>');

                // Verificar que o código está bem formatado
                const linhas = resultado.split('\n');
                expect(linhas.length).toBeGreaterThan(20); // Muitas linhas formatadas
            });

            it('Complexo - Formulário completo', () => {
                const codigo = '<formulario acao="/enviar" metodo="post"><rotulo para="nome">Nome:</rotulo><entrada-texto id="nome" nome="nome" tipo="text" obrigatorio="true" /><rotulo para="email">Email:</rotulo><entrada-texto id="email" nome="email" tipo="email" /><botao tipo="submit">Enviar</botao></formulario>';
                
                const resultado = formatar(codigo, {
                    tamanhoIdentacao: 2,
                    quebrarAtributosEmLinhas: false
                });

                expect(resultado).toContain('<formulario acao="/enviar" metodo="post">');
                expect(resultado).toContain('  <rotulo para="nome">Nome:</rotulo>');
                expect(resultado).toContain('  <entrada-texto id="nome" nome="nome" tipo="text" obrigatorio="true" />');
                expect(resultado).toContain('  <botao tipo="submit">Enviar</botao>');
                expect(resultado).toContain('</formulario>');
            });

            it('Complexo - Tabela com dados', () => {
                const codigo = '<tabela><linha-tabela><celula-cabecalho>Nome</celula-cabecalho><celula-cabecalho>Idade</celula-cabecalho></linha-tabela><linha-tabela><celula-dados>João</celula-dados><celula-dados>25</celula-dados></linha-tabela></tabela>';
                
                const resultado = formatar(codigo);

                expect(resultado).toContain('<tabela>');
                expect(resultado).toContain('    <linha-tabela>');
                expect(resultado).toContain('        <celula-cabecalho>Nome</celula-cabecalho>');
                expect(resultado).toContain('        <celula-cabecalho>Idade</celula-cabecalho>');
                expect(resultado).toContain('        <celula-dados>João</celula-dados>');
                expect(resultado).toContain('        <celula-dados>25</celula-dados>');
            });
        });
    });
});