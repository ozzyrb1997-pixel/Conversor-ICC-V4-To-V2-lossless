const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;
const HOST = '127.0.0.1';

// Configuração do diretório de uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const upload = multer({ dest: 'uploads/' });

// Servir ficheiros estáticos da pasta 'public'
app.use(express.static('public'));

// Rota de conversão V4 para V2
app.post('/convert', upload.single('iccFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("Nenhum ficheiro foi enviado para conversão.");
    }

    const inputPath = req.file.path;
    const outputFilename = `v2_lossless_${Date.now()}.icc`;
    const outputPath = path.join(uploadsDir, outputFilename);

    try {
        const fileBuffer = fs.readFileSync(inputPath);
        
        // Validação básica (verificar se é ICC)
        if (fileBuffer.toString('ascii', 36, 40) !== 'acsp') {
            fs.unlinkSync(inputPath);
            return res.status(400).send('Erro: Ficheiro não é um perfil ICC válido.');
        }

        // Patch do cabeçalho
        fileBuffer.writeUInt8(2, 8);  // Versão 2
        fileBuffer.writeUInt8(16, 9); // Sub-versão 1.0

        fs.writeFileSync(outputPath, fileBuffer);
        
        // Enviar o ficheiro convertido
        res.download(outputPath, 'perfil_convertido_v2.icc', (err) => {
            // Limpeza pós-download
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno ao processar o perfil.');
    }
});

// Inicialização
app.listen(PORT, HOST, () => {
    console.log(`\n===================================================`);
    console.log(`✅ SERVIDOR ONLINE!`);
    console.log(`👉 Aceda em: http://${HOST}:${PORT}`);
    console.log(`===================================================\n`);
});