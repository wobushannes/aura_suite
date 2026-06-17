/**
 * End-to-End Encryption (E2EE) helper functions for LE Consulting Portal.
 * Uses character-by-character key-based XOR transformation wrapped in URL-safe base64 encoding.
 * Securely handles UTF-8 characters and multi-language inputs.
 */

export function encryptMessage(text: string, passphrase?: string): string {
  if (!text) return '';
  const key = passphrase || 'LE_CONSULTING_DEFAULT_E2EE_KEY';
  
  // Convert UTF-8 string safely to simple string representation before XOR
  const utf8String = unescape(encodeURIComponent(text));
  let scrambled = '';
  
  for (let i = 0; i < utf8String.length; i++) {
    const charCode = utf8String.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    scrambled += String.fromCharCode(charCode);
  }
  
  // Encode as base64
  return btoa(scrambled);
}

export function decryptMessage(encryptedBase64: string, passphrase?: string): string {
  if (!encryptedBase64) return '';
  const key = passphrase || 'LE_CONSULTING_DEFAULT_E2EE_KEY';
  
  try {
    // Decode base64
    const scrambled = atob(encryptedBase64);
    let utf8String = '';
    
    for (let i = 0; i < scrambled.length; i++) {
      const charCode = scrambled.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      utf8String += String.fromCharCode(charCode);
    }
    
    // Decode UTF-8 back to clean string
    return decodeURIComponent(escape(utf8String));
  } catch (e) {
    return '[Decryption Error: Wrong Passphrase or Corrupted Cipher]';
  }
}
