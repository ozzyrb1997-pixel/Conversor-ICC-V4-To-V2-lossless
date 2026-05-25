const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;
const HOST = '127.0.0.1';

// ==========================================
// 1. AUTO-CONFIGURAÇÃO DE PASTAS E INTERFACE
// ==========================================
const uploadsDir = path.join(__dirname, 'uploads');
const publicDir = path.join(__dirname, 'public');
const htmlFile = path.join(publicDir, 'index.html');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

if (!fs.existsSync(htmlFile)) {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversor de Perfis ICC v4 para v2 (Header Patch)</title>
    <style>
        :root { --primary: #10b981; --bg: #f8fafc; --card: #ffffff; --text: #1e293b; }
        body { font-family: system-ui, sans-serif; background-color: var(--bg); color: var(--text); display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .container { background: var(--card); padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); width: 100%; max-width: 480px; text-align: center; }
        h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #0f172a; }
        p { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }
        .dropzone { border: 2px dashed #cbd5e1; padding: 2rem; border-radius: 8px; cursor: pointer; transition: all 0.2s; position: relative; }
        .dropzone:hover { border-color: var(--primary); background: #f1f5f9; }
        .dropzone input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        button { margin-top: 1.5rem; width: 100%; padding: 0.75rem; background: var(--primary); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-size: 1rem;}
        button:hover { background: #059669; }
        #status { margin-top: 1rem; font-size: 0.85rem; font-weight: 500; color: #10b981;}
    </style>
</head>
<body>
<div class="container">
    <h1>Conversor ICC (Lossless)</h1>
    <p>Converte a assinatura do seu perfil V4 para V2 mantendo 100% dos dados originais da calibração intocados.</p>
    <form id="uploadForm" action="/api/convert" method="POST" enctype="multipart/form-data">
        <div class="dropzone">
            <span id="fileName">Arraste o seu perfil .icc ou .icm aqui</span>
            <input type="file" name="iccProfile" id="iccProfile" accept=".icc,.icm" required onchange="updateLabel()">
        </div>
        <button type="submit" onclick="showStatus()">Modificar Cabeçalho para V2</button>
    </form>
    <div id="status"></div>
</div>
<script>
    function updateLabel() {
        const input = document.getElementById('iccProfile');
        if(input.files.length > 0) document.getElementById('fileName').textContent = input.files[0].name;
    }
    function showStatus() {
        if(document.getElementById('iccProfile').files.length > 0) {
            document.getElementById('status').textContent = 'Processando... O download começará em instantes.';
        }
    }
</script>
</body>
</html>`;
    fs.writeFileSync(htmlFile, htmlContent);
}

// ==========================================
// 2. CONFIGURAÇÃO DO SERVIDOR E ROTAS
// ==========================================
app.use(express.static('public'));
const upload = multer({ dest: 'uploads/' });

app.post('/api/convert', upload.single('iccProfile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }

    const inputPath = req.file.path;
    const outputFilename = `v2_lossless_${Date.now()}.icc`;
    const outputPath = path.join(uploadsDir, outputFilename);

    try {
        // 1. Lê o arquivo binário inteiro para a memória (RAM)
        const fileBuffer = fs.readFileSync(inputPath);
        
        // 2. Segurança: Verifica se é realmente um arquivo ICC validando o "Magic Number" no byte 36
        const magicNumber = fileBuffer.toString('ascii', 36, 40);
        if (magicNumber !== 'acsp') {
            fs.unlinkSync(inputPath);
            return res.status(400).send('Erro: O arquivo enviado não é um perfil ICC válido.');
        }

        // 3. Lê o byte da versão atual
        const version = fileBuffer.readUInt8(8);
        
        // 4. Se for V4 (ou maior), faz o downgrade da assinatura para V2.1.0
        if (version >= 4) {
            fileBuffer.writeUInt8(2, 8);  // Altera a versão principal de 4 para 2
            fileBuffer.writeUInt8(16, 9); // Altera a sub-versão para 1 (0x10 em Hexadecimal = 16)
        }

        // 5. Salva o novo arquivo binário modificado
        fs.writeFileSync(outputPath, fileBuffer);
        
        // Limpa o arquivo original temporário enviado pelo upload
        fs.unlinkSync(inputPath);

        // 6. Devolve o arquivo modificado e limpa o servidor logo após o download
        res.download(outputPath, req.file.originalname.replace(/\.ic[c|m]/i, '_v2_lossless.icc'), (err) => {
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Erro na manipulação dos bytes do ICC:', error);
        res.status(500).send('Erro interno ao processar o perfil de cores.');
    }
});

// ==========================================
// 3. INICIALIZAÇÃO DO SISTEMA
// ==========================================
app.listen(PORT, HOST, () => {
    console.log('\n===================================================');
    console.log('✅ SERVIDOR NATIVO LOSSLESS INICIADO!');
    console.log(`👉 Acesso no navegador: http://${HOST}:${PORT}`);
    console.log('===================================================\n');
});