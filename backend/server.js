const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/identify-animal', upload.single('animalImage'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileUrl = `http://localhost:${port}/${filePath}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: "Qual o nome do animal da foto?" },
                        { type: 'image_url', image_url: { url: fileUrl } },
                    ],
                },
            ],
        });

        const speciesName = response.choices[0].message.content;
        res.json({ speciesName });

        var messageName = document.getElementById("message-name");
        messageName.innerText = speciesName;

        fs.unlink(filePath, (err) => {
            if (err) console.error('Erro ao deletar arquivo temporário:', err);
        });

    } catch (error) {
        console.error('Erro ao identificar imagem:', error);
        res.status(500).send('Erro ao identificar imagem.');
    }
});

app.post('/get-animal-info', async (req, res) => {
    try {
        const { speciesName } = req.body;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: `<Me de informações relevantes sobre o seguinte animal:> ${speciesName}.`,
                },
            ],
        });

        const animalInfo = response.choices[0].message.content;
        res.json({ animalInfo });

        var message = document.getElementById("message");
        message.innerText = animalInfo;

    } catch (error) {
        console.error('Erro ao obter informações sobre o animal:', error);
        res.status(500).send('Erro ao obter informações sobre o animal.');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
