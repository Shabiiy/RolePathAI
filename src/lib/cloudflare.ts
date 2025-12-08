
export async function generateMindmapImage(prompt: string): Promise<string | null> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        console.error('Missing Cloudflare credentials');
        return null;
    }

    const model = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `A professional, clean, high-quality mindmap diagram for: ${prompt}. White background, clear structure, colorful nodes.`,
                num_steps: 20,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Cloudflare AI Error: ${response.status} ${response.statusText}`, errorText);
            return null;
        }

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/png;base64,${base64}`;

    } catch (error) {
        console.error('Error generating mindmap image:', error);
        return null;
    }
}

export async function generateText(prompt: string): Promise<string | null> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        console.error('Missing Cloudflare credentials');
        return null;
    }

    const model = '@cf/meta/llama-3-8b-instruct';
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a helpful assistant that outputs only valid JSON." },
                    { role: "user", content: prompt }
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Cloudflare AI Error: ${response.status} ${response.statusText}`, errorText);
            return null;
        }

        const result = await response.json();
        return result.result.response;

    } catch (error) {
        console.error('Error generating text:', error);
        return null;
    }
}
