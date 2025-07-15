from googletrans import Translator

translator = Translator()

def translate_text(text, target_lang='en'):
    return translator.translate(text, dest=target_lang).text

def detect_language(text):
    return translator.detect(text).lang
