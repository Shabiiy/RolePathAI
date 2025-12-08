
require('dotenv').config();

async function testRaw() {
    const key = process.env.GOOGLE_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

    const data = {
        contents: [{
            parts: [{ text: "Hello" }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (!response.ok) {
            console.log("HTTP ERROR:", response.status);
            console.log(JSON.stringify(json, null, 2));
        } else {
            console.log("SUCCESS!");
            console.log(JSON.stringify(json, null, 2));
        }
    } catch (e) {
        console.log("NETWORK ERROR:", e);
    }
}

testRaw();
