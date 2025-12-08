
require('dotenv').config();

const key = process.env.GOOGLE_API_KEY;

if (!key) {
    console.log("ERROR: GOOGLE_API_KEY is missing from .env");
} else {
    console.log(`Key found. Length: ${key.length}`);
    console.log(`Start: ${key.substring(0, 5)}...`);
    console.log(`End: ...${key.substring(key.length - 5)}`);

    if (key.includes(' ')) {
        console.log("WARNING: Key contains spaces!");
    }
    if (key.includes('"') || key.includes("'")) {
        console.log("WARNING: Key contains quotes (it should not be inside quotes in .env usually, or dotenv handles it)!");
    }
}
