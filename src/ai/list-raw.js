
require('dotenv').config();
const fs = require('fs');

async function listRaw() {
    const key = process.env.GOOGLE_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const json = await response.json();

        if (json.models) {
            const names = json.models.map(m => m.name).join('\n');
            fs.writeFileSync('models.txt', names);
            console.log("Saved to models.txt");
        }
    } catch (e) {
        console.log("ERROR:", e);
    }
}

listRaw();
