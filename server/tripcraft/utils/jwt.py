from typing import Any, Dict

import jwt


def encode(payload: Dict[str, Any], key: str) -> str:
    return jwt.encode(payload, key)


def decode(token: str, key: str) -> Dict[str, Any]:
    return jwt.decode(token, key, algorithms=["HS256"])
