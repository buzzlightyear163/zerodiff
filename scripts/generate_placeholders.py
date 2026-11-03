"""Genererar neutrala, lokala platshållarbilder (gråskala) för klonen.

Bilderna ersätter referensens foton med samma roll och format:
mörka, korniga gråskalebilder med ett enkelt motiv per bild.
Kör: python scripts/generate_placeholders.py
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "img")
os.makedirs(OUT, exist_ok=True)


def base(w, h, top=34, bottom=12, seed=1):
    random.seed(seed)
    img = Image.new("L", (w, h))
    px = img.load()
    for y in range(h):
        v = top + (bottom - top) * (y / h)
        for x in range(w):
            px[x, y] = int(v)
    return img


def finish(img, name, noise=26, blur=1.2, vignette=0.55, seed=2):
    random.seed(seed)
    w, h = img.size
    img = img.filter(ImageFilter.GaussianBlur(blur))
    n = Image.effect_noise((w, h), noise).point(lambda p: p - 128)
    img = Image.eval(img, lambda p: p)
    out = Image.new("L", (w, h))
    a, b, o = img.load(), n.load(), out.load()
    cx, cy = w / 2, h / 2
    md = math.hypot(cx, cy)
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / md
            v = a[x, y] * (1 - vignette * d * d) + b[x, y] * 0.35
            o[x, y] = max(0, min(255, int(v)))
    out.convert("RGB").save(os.path.join(OUT, name), quality=82)
    print("wrote", name)


def hero_room():
    w, h = 1600, 1000
    img = base(w, h, 30, 14)
    d = ImageDraw.Draw(img)
    # fönster till höger
    for i in range(3):
        x0 = 980 + i * 190
        d.rectangle([x0, 120, x0 + 160, 620], fill=70 - i * 8)
        for k in range(1, 4):
            d.line([x0, 120 + k * 125, x0 + 160, 120 + k * 125], fill=30, width=6)
        d.line([x0 + 80, 120, x0 + 80, 620], fill=30, width=6)
    # golv och ljusfall
    d.polygon([(700, 1000), (1600, 1000), (1600, 760), (1000, 700)], fill=40)
    for i in range(40):
        y = 700 + i * 8
        d.line([(0, y), (w, y + 30)], fill=22 + (i % 3) * 3, width=1)
    finish(img, "hero-room.jpg", blur=3)


def card_wish():
    w, h = 900, 760
    img = base(w, h, 28, 16, 3)
    d = ImageDraw.Draw(img)
    for i in range(0, w, 60):
        d.line([(i, 0), (i, h)], fill=24, width=2)
    d.rectangle([520, 160, 690, 380], fill=150)
    for k in range(6):
        d.line([(540, 200 + k * 26), (670 - (k % 2) * 30, 200 + k * 26)], fill=90, width=3)
    d.ellipse([598, 150, 612, 164], fill=60)
    d.rectangle([80, 420, 360, 760], fill=22)
    finish(img, "card-wish.jpg", blur=2)


def card_hunt():
    w, h = 900, 760
    img = base(w, h, 40, 18, 4)
    d = ImageDraw.Draw(img)
    for i in range(160):
        x, y = random.randint(0, w), random.randint(0, 420)
        r = random.randint(8, 40)
        d.ellipse([x - r, y - r, x + r, y + r], fill=random.randint(30, 70))
    d.rectangle([250, 300, 650, 600], fill=60)
    d.rectangle([290, 330, 610, 540], fill=95)
    for k in range(8):
        d.line([(310, 350 + k * 22), (560 - (k * 23) % 140, 350 + k * 22)], fill=150, width=4)
    d.rectangle([200, 600, 700, 660], fill=45)
    finish(img, "card-hunt.jpg", blur=2.2)


def card_unlock():
    w, h = 900, 760
    img = base(w, h, 22, 10, 5)
    d = ImageDraw.Draw(img)
    vx, vy = 450, 380
    for col in range(-5, 6):
        x = 450 + col * 160
        d.line([(x, 0), (vx + (x - vx) * 0.25, vy)], fill=46, width=3)
        d.line([(x, h), (vx + (x - vx) * 0.25, vy)], fill=40, width=3)
    for row in range(1, 10):
        t = row / 10
        d.line([(0, vy - (vy) * t), (w, vy - vy * t)], fill=30, width=2)
    d.rectangle([600, 420, 680, 470], fill=170)
    finish(img, "card-unlock.jpg", blur=2)


def wall_scope():
    w, h = 600, 900
    img = base(w, h, 26, 12, 6)
    d = ImageDraw.Draw(img)
    d.rectangle([60, 180, 540, 560], fill=40)
    d.rectangle([90, 210, 510, 530], fill=58)
    for gx in range(90, 511, 60):
        d.line([(gx, 210), (gx, 530)], fill=70)
    for gy in range(210, 531, 40):
        d.line([(90, gy), (510, gy)], fill=70)
    pts = [(x, 370 + math.sin(x / 30) * 90) for x in range(90, 511, 3)]
    d.line(pts, fill=210, width=4)
    for i in range(14):
        d.ellipse([100 + i * 32, 620, 118 + i * 32, 638], fill=80)
    finish(img, "wall-scope.jpg", blur=1.4)


def wall_tape():
    w, h = 600, 900
    img = base(w, h, 30, 14, 7)
    d = ImageDraw.Draw(img)
    for cx in (180, 420):
        d.ellipse([cx - 120, 200, cx + 120, 440], fill=55)
        d.ellipse([cx - 40, 280, cx + 40, 360], fill=20)
        for a in range(0, 360, 60):
            r = math.radians(a)
            d.line([(cx, 320), (cx + math.cos(r) * 110, 320 + math.sin(r) * 110)], fill=35, width=8)
    d.line([(60, 560), (540, 560)], fill=140, width=6)
    d.rectangle([40, 600, 560, 820], fill=36)
    finish(img, "wall-tape.jpg", blur=1.6)


def wall_cards():
    w, h = 600, 900
    img = base(w, h, 24, 12, 8)
    d = ImageDraw.Draw(img)
    for i in range(5):
        x0, y0 = 70 + i * 22, 140 + i * 110
        d.rectangle([x0, y0, x0 + 420, y0 + 220], fill=120 - i * 12)
        for r in range(8):
            for c in range(30):
                if random.random() < 0.35:
                    d.rectangle([x0 + 20 + c * 13, y0 + 30 + r * 22, x0 + 26 + c * 13, y0 + 42 + r * 22], fill=30)
    finish(img, "wall-cards.jpg", blur=1.3)


def wall_fiche():
    w, h = 600, 900
    img = base(w, h, 20, 10, 9)
    d = ImageDraw.Draw(img)
    d.rectangle([60, 120, 540, 760], fill=70)
    for r in range(16):
        for c in range(12):
            v = random.randint(90, 180)
            d.rectangle([80 + c * 38, 140 + r * 38, 108 + c * 38, 168 + r * 38], fill=v)
    finish(img, "wall-fiche.jpg", blur=1.2)


def cube_barcode():
    w, h = 600, 600
    img = base(w, h, 36, 20, 10)
    d = ImageDraw.Draw(img)
    x = 70
    while x < 530:
        bw = random.choice([3, 5, 8, 12])
        d.rectangle([x, 110, x + bw, 470], fill=200)
        x += bw + random.choice([4, 6, 10])
    finish(img, "cube-barcode.jpg", blur=0.8)


def cube_lock():
    w, h = 600, 600
    img = base(w, h, 28, 14, 11)
    d = ImageDraw.Draw(img)
    d.arc([200, 110, 400, 330], 180, 360, fill=150, width=34)
    d.line([(217, 220), (217, 290)], fill=150, width=34)
    d.line([(383, 220), (383, 290)], fill=150, width=34)
    d.rounded_rectangle([160, 280, 440, 500], 20, fill=120)
    d.ellipse([285, 350, 315, 380], fill=30)
    d.rectangle([294, 370, 306, 430], fill=30)
    finish(img, "cube-lock.jpg", blur=1.3)


def stairwell():
    w, h = 600, 600
    img = base(w, h, 30, 10, 12)
    d = ImageDraw.Draw(img)
    for i in range(26):
        r = 280 - i * 10
        d.ellipse([300 - r, 300 - r, 300 + r, 300 + r], outline=40 + (i % 2) * 40, width=5)
    for a in range(0, 360, 15):
        rr = math.radians(a)
        d.line([(300, 300), (300 + math.cos(rr) * 280, 300 + math.sin(rr) * 280)], fill=26, width=2)
    finish(img, "stairwell.jpg", blur=1.6)


def ascii_sphere():
    w, h = 1000, 1000
    img = Image.new("L", (w, h), 14)
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("DejaVuSansMono.ttf", 15)
    except OSError:
        font = ImageFont.load_default()
    R = 430
    rows = 46
    idx = 0
    for i in range(rows):
        lat = -math.pi / 2 + (i + 0.5) / rows * math.pi
        n = max(4, round(math.cos(lat) * 70))
        for j in range(n):
            lon = j / n * math.pi * 2
            x = math.cos(lat) * math.sin(lon)
            y = math.sin(lat)
            z = math.cos(lat) * math.cos(lon)
            if z < 0:
                continue
            v = int(70 + 170 * z)
            hx = format((idx * 2654435761 >> 8) & 255, "02X")
            d.text((w / 2 + x * R, h / 2 + y * R), hx, fill=v, font=font, anchor="mm")
            idx += 1
    d.line([(40, 300), (960, 820)], fill=90, width=2)
    img = img.filter(ImageFilter.GaussianBlur(0.4))
    img.convert("RGB").save(os.path.join(OUT, "ascii-sphere.jpg"), quality=86)
    print("wrote ascii-sphere.jpg")


if __name__ == "__main__":
    hero_room()
    card_wish()
    card_hunt()
    card_unlock()
    wall_scope()
    wall_tape()
    wall_cards()
    wall_fiche()
    cube_barcode()
    cube_lock()
    stairwell()
    ascii_sphere()
