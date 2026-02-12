
const apiKey = 'AIzaSyBZBWch9Lm6-YmSi4iw5uaKS3heXaYcVPo';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
    try {
        console.log(`Fetching ${url.replace(apiKey, 'REDACTED')}...`);
        const response = await fetch(url);

        console.log('Status:', response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error('Error Body:', error);
            return;
        }

        const data = await response.json();
        console.log('Models found:', data.models.map((m: any) => m.name));
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

listModels();
