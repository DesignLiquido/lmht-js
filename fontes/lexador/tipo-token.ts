export enum TipoToken {
    // Estrutura de tags
    MENOR_QUE = 'MENOR_QUE',                    // <
    MAIOR_QUE = 'MAIOR_QUE',                    // >
    BARRA = 'BARRA',                            // /
    MENOR_QUE_BARRA = 'MENOR_QUE_BARRA',       // </
    BARRA_MAIOR_QUE = 'BARRA_MAIOR_QUE',       // />
    
    // Atributos
    IGUAL = 'IGUAL',                            // =
    ASPAS_DUPLAS = 'ASPAS_DUPLAS',             // "
    ASPAS_SIMPLES = 'ASPAS_SIMPLES',           // '
    
    // Conteúdo
    IDENTIFICADOR = 'IDENTIFICADOR',            // nome de tag ou atributo
    TEXTO = 'TEXTO',                            // conteúdo textual
    VALOR_ATRIBUTO = 'VALOR_ATRIBUTO',         // valor entre aspas
    
    // Comentários
    COMENTARIO = 'COMENTARIO',                  // <!-- -->
    
    // Especiais
    DECLARACAO_XML = 'DECLARACAO_XML',          // <?xml ... ?>
    DOCTYPE = 'DOCTYPE',                        // <!DOCTYPE ...>
    CDATA = 'CDATA',                           // <![CDATA[ ... ]]>
    
    // Controle
    NOVA_LINHA = 'NOVA_LINHA',
    ESPACO = 'ESPACO',
    EOF = 'EOF'
}