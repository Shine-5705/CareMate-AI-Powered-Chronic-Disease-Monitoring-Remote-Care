def check_emergency(text):
    red_flags = ['chest pain', 'breathless', 'faint', 'unconscious', 'seizure', 'vomiting blood']
    return any(flag in text.lower() for flag in red_flags)
