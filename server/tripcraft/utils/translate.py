import opencc
from deep_translator import GoogleTranslator


def chinese_simplified_to_traditional(s: str):
    converter = opencc.OpenCC("s2t.json")
    return converter.convert(s)


def to_chinese_simplified(s: str):
    translator = GoogleTranslator(source="auto", target="zh-CN")
    return translator.translate(s)
