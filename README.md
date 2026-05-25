# Conversor ICC Lossless (v4 para v2) 🎨

Uma ferramenta web leve construída em Node.js para converter a assinatura de perfis de cor ICC V4 para V2 utilizando a técnica de **Header Patching**.

## 📌 O Problema
Softwares de ripagem mais antigos, plotters de impressão e alguns motores de renderização não suportam perfis de cor padrão ICC V4, exigindo o formato legado V2. A conversão tradicional entre versões frequentemente resulta em perda de qualidade na calibração, pois força o "esmagamento" de curvas matemáticas (v4) em tabelas LUT (v2), gerando erros de quantização (Delta-E).

## 💡 A Solução (Lossless)
Em vez de re-interpolar o espaço de cor e degradar a precisão dependendo de binários externos (`.exe`), esta aplicação atua como um editor hexadecimal automatizado em memória nativa. O sistema lê o buffer binário do ficheiro `.icc`/`.icm`, localiza exatamente o offset do Byte 8 (onde a versão do formato é declarada) e aplica um patch fazendo o downgrade da assinatura de `0x04` para `0x02`. 

**O resultado:** O software de destino aceita o ficheiro acreditando ser um V2 autêntico, mantendo 100% das matrizes e dados originais de calibração rigorosamente intocados.

## 🚀 Tecnologias Utilizadas
* **Backend:** Node.js, Express
* **Manipulação de Ficheiros:** Multer, manipulação nativa de Buffers (File System).
* **Frontend:** HTML5, CSS3, JavaScript Vanilla (gerado dinamicamente pelo servidor).

## 🛠️ Como Instalar e Rodar Localmente

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/SEU_USUARIO/conversor-icc-lossless.git
\`\`\`

2. Navegue até a pasta do projeto:
\`\`\`bash
cd conversor-icc-lossless
\`\`\`

3. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

4. Inicie o servidor:
\`\`\`bash
npm start
\`\`\`
*(Ou execute `node server.js`)*

5. Aceda no seu navegador através do link local fornecido no terminal (ex: `http://127.0.0.1:8080`).

---

## 🛑 Solução de Problemas Comuns (Troubleshooting)

Se estiver a configurar o ambiente no **Windows**, pode deparar-se com alguns erros comuns relacionados com políticas de segurança ou rede. Aqui estão as soluções rápidas:

### 1. Erro: `O termo 'npm' não é reconhecido...`
* **Causa:** O Node.js não está instalado ou não foi adicionado às Variáveis de Ambiente (PATH) do Windows.
* **Solução:** Descarregue a versão LTS no [site oficial do Node.js](https://nodejs.org/). Durante a instalação, certifique-se de que a opção "Add to PATH" está selecionada. Após a instalação, reinicie completamente o terminal.

### 2. Erro: `A execução de scripts foi desabilitada neste sistema` (PowerShell)
* **Causa:** O Windows PowerShell bloqueia a execução de scripts (`npm.ps1`) por defeito por motivos de segurança.
* **Solução:** Pode usar o *Prompt de Comando* (CMD) normal, ou liberar a execução no PowerShell rodando o seguinte comando como Administrador:
  \`\`\`powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  \`\`\`
  *(Pressione 'S' ou 'Y' para confirmar).*

### 3. Erro: `Cannot find module 'express'`
* **Causa:** O servidor tentou iniciar, mas as bibliotecas não foram descarregadas para a pasta do projeto.
* **Solução:** Execute o comando `npm install` para forçar o download das dependências (Express e Multer) listadas no ficheiro `package.json`.

### 4. Erro no Navegador: `ERR_CONNECTION_REFUSED` (A página não carrega)
* **Causa 1 (Terminal Fechado):** O servidor Node.js só funciona enquanto o terminal estiver aberto e o processo estiver a rodar. Se fechar a janela preta ou pressionar `Ctrl + C`, o servidor desliga e o navegador perde o acesso. **Solução:** Deixe o terminal minimizado a rodar em segundo plano.
* **Causa 2 (Conflito IPv6):** Nas versões mais recentes do Node.js, tentar aceder via `localhost` pode causar conflito entre IPv4 e IPv6. **Solução:** Utilize o IP direto forçado pela aplicação. Escreva exatamente `http://127.0.0.1:8080` na barra de endereços do navegador.

---

## 📁 Estrutura do Projeto
O sistema é auto-contido. Ao ser executado pela primeira vez, ele constrói automaticamente a interface web estática (`public/index.html`) e a pasta de trabalho temporária (`uploads/`), garantindo que a aplicação não falhe por ausência de diretórios base.