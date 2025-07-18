def detect_language(text):
    if any('\u0900' <= c <= '\u097F' for c in text): return 'hi'
    if any('\u0980' <= c <= '\u09FF' for c in text): return 'bn'
    if any('\u0C00' <= c <= '\u0C7F' for c in text): return 'te'
    if any('\u0B80' <= c <= '\u0BFF' for c in text): return 'ta'
    if any('\u0A80' <= c <= '\u0AFF' for c in text): return 'gu'
    return 'en'
