// Returns the API base URL for client-side fetch calls.
// In Docker, NEXT_PUBLIC_API_URL is set to "" at build time,
// which means API calls use relative URLs through nginx proxy.
// In local dev, it defaults to http://localhost:8081.
export function getApiUrl(): string {
    const url = process.env.NEXT_PUBLIC_API_URL;
    // If explicitly set (even to empty string), use that value
    if (url !== undefined) return url;
    // Default for local development
    return 'http://localhost:8081';
}
