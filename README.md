# Legibilidade PT-BR

Plugin de assistente de legibilidade para o Inkdrop, focado em textos em português do Brasil.

## Descrição

Este plugin analisa o texto no editor do Inkdrop e destaca elementos que podem afetar a legibilidade, como:

- Palavras complexas (com mais de 13 letras)
- Uso de voz passiva
- Uso excessivo de advérbios terminados em "mente"
- Clichês e expressões muito usadas
- Jargões técnicos
- Uso excessivo de palavras de transição
- Duplas negativas
- Repetição de palavras consecutivas

## Instalação

1. **Ative o Modo de Desenvolvimento no Inkdrop**:

   - Abra o Inkdrop.
   - Vá em `Arquivo > Configurações` (ou `Inkdrop > Preferências` no macOS).
   - Na aba `Geral`, marque a opção `Modo de Desenvolvimento`.
   - Reinicie o Inkdrop.

2. **Linkar o Plugin Localmente**:

   No terminal, navegue até o diretório do plugin e execute:

   ```bash
   ipm link --dev
