import random


def random_otp():
    return "".join([str(random.randint(0, 9)) for _ in range(6)])
