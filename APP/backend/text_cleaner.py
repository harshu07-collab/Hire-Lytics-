import re
from collections import OrderedDict


def advanced_clean_text(text: str) -> str:
    """
    Clean and normalize raw PDF-extracted resume text.
    Removes noise, fixes whitespace, deduplicates lines.
    """
    text = text.replace('\r', '\n')
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    text = re.sub(r'[•●▪►✔➢▪·]', '', text)
    text = re.sub(r'Page\s*\d+(\s*of\s*\d+)?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n\d+\n', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    text = re.sub(r'-\n', '', text)
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
    text = re.sub(r'\n{2,}', '\n\n', text)

    lines = [line.strip() for line in text.split('\n')]
    lines = list(OrderedDict.fromkeys(lines))       # deduplicate while preserving order
    lines = [line for line in lines if len(line) > 2]

    return "\n".join(lines)
