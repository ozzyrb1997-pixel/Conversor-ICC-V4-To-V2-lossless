# \# Conversor ICC Lossless (v4 para v2) 🎨

# 

# Uma ferramenta de engenharia de cores de alta precisão para conversão de perfis ICC V4 (modernos) para V2 (legados) utilizando a técnica de \*\*Header Patching Lossless\*\*.

# 

# \## 📌 O Problema

# Softwares de RIP antigos e sistemas legados rejeitam perfis ICC V4. A conversão tradicional via software de calibração degrada a precisão do perfil, introduzindo erros Delta-E através da re-interpolação de tabelas LUT.

# 

# \## 💡 A Solução (Lossless)

# Este conversor realiza o \*downgrade\* apenas da assinatura do cabeçalho do perfil ICC (Bytes 8-9).

# \* \*\*Integridade Total:\*\* As matrizes de cor e tabelas LUT permanecem bit a bit idênticas.

# \* \*\*Compatibilidade:\*\* O sistema alvo reconhece o perfil como um V2 autêntico.

# \* \*\*Diagnóstico:\*\* Inclui um Analisador de Gamut CIE 1931 com cálculo de perda de cobertura.

# 

# \## 🚀 Funcionalidades

# 1\. \*\*Dashboard Central:\*\* Interface intuitiva (`index.html`).

# 2\. \*\*Conversor Lossless:\*\* Patch binário via servidor Node.js.

# 3\. \*\*Analisador de Gamut:\*\* Motor avançado para visualização gráfica e cálculo de cobertura sRGB.

# 

# \## ⚙️ Como Utilizar

# 1\. \*\*Instalar:\*\* `npm install`

# 2\. \*\*Executar:\*\* `node server.js`

# 3\. \*\*Acesso:\*\* Abra `http://127.0.0.1:8080` no seu navegador.

# 

# \---

# 

# \## 📝 Changelog (Histórico)

# 

# \### \[1.1.0] - 2026-05-25 (Versão Atual)

# \* \*\*Dashboard:\*\* Nova interface central para navegação.

# \* \*\*Analisador:\*\* Motor avançado com cálculo matemático de perda de gamut em relação ao sRGB.

# \* \*\*Arquitetura:\*\* Separação entre motor (server.js) e interface estática (public/).

# \* \*\*Precisão:\*\* Ajuste da constante de área sRGB para 0.11205.

# 

# \### \[1.0.0] - Lançamento Inicial

# \* Implementação do patching binário de cabeçalho ICC via Node.js Buffer.

# 

# \---

# 

# \*Ferramenta desenvolvida para diagnóstico e preservação de precisão em fluxos de trabalho de impressão.\*

