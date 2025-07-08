// XOR function
export const xor = (buffer: Uint8Array, key: any): Uint8Array => {
    const keyBytes = new TextEncoder().encode(key);
    const result = new Uint8Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ keyBytes[i % keyBytes.length];
    }
    return result;
};

// Decrypt function
export const decrypt = (encrypted: string): any => {
    const encryptedBytes = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const decryptedBytes = xor(encryptedBytes, "MYSECRETKEY123");
    const decryptedText = new TextDecoder().decode(decryptedBytes);

    try {
        return JSON.parse(decryptedText);
    } catch {
        return decryptedText;
    }
};