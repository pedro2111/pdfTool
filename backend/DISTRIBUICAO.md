# Instruções para Distribuir (Para Leigos)

Para compartilhar este aplicativo com alguém que não é programador:

## Opção 1: Computador com Node.js (Mais Simples)
1. Certifique-se que o computador de destino tem o [Node.js](https://nodejs.org/) instalado.
2. Copie a pasta `backend` inteira (você pode renomear para `ConversorPDF`).
3. Dê um clique duplo no arquivo `start.bat` dentro da pasta.
4. O navegador abrirá automaticamente com o app rodando.

## Opção 2: Totalmente Portátil (Sem instalar nada)
Para fazer o app rodar sem instalar o Node.js:
1. Baixe o executável do Node.js (versão ZIP/Binário) do site oficial.
2. Coloque o arquivo `node.exe` dentro da pasta `backend`.
3. Edite o arquivo `start.bat` e mude:
   `node dist/server.js`
   para
   `node.exe dist/server.js`
4. Agora basta enviar a pasta `backend` zipada. A pessoa só precisa extrair e clicar no `start.bat`.
