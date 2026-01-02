const enc = new TextEncoder();
const dec = new TextDecoder();

function b64encode(buf: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function b64decode(str: string) {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

export async function generateKey() {
    return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function exportKey(key: CryptoKey) {
    const raw = await crypto.subtle.exportKey("raw", key);
    return b64encode(raw);
}

export async function importKey(keyB64: string) {
    return crypto.subtle.importKey("raw", b64decode(keyB64), "AES-GCM", true, ["decrypt"]);
}

export async function encryptText(plaintext: string, key: CryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
    return { iv: b64encode(iv.buffer), data: b64encode(ciphertext) };
}

export async function decryptText(data: string, iv: string, key: CryptoKey) {
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64decode(iv) }, key, b64decode(data));
    return dec.decode(decrypted);
}