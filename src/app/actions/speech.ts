'use server';

export async function transcribeAudio(audioContent: string) {
    const apiKey = process.env.GOOGLE_SPEECH_TO_TEXT_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_SPEECH_TO_TEXT_API_KEY is not defined');
    }

    const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                config: {
                    encoding: 'WEBM_OPUS',
                    sampleRateHertz: 48000,
                    languageCode: 'en-US',
                },
                audio: {
                    content: audioContent,
                },
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('STT API Error:', error);
        throw new Error(error.error?.message || 'Failed to transcribe audio');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return '';
    }

    return data.results
        .map((result: any) => result.alternatives[0].transcript)
        .join('\n');
}
