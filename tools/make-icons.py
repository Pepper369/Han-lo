"""Sinh bộ icon PWA từ chữ 汉. Chạy: python tools/make-icons.py
Cần Pillow + font CJK của Windows (Microsoft YaHei Bold)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "icons"
OUT.mkdir(exist_ok=True)

INK = (33, 31, 27)
PAPER = (246, 242, 234)
FONT = Path(r"C:\Windows\Fonts\msyhbd.ttc")
GLYPH = "汉"


def make(size: int, name: str, pad: float, dest: Path = None) -> None:
    img = Image.new("RGB", (size, size), INK)
    d = ImageDraw.Draw(img)
    box = int(size * (1 - 2 * pad))
    font = ImageFont.truetype(str(FONT), box)
    left, top, right, bottom = d.textbbox((0, 0), GLYPH, font=font)
    x = (size - (right - left)) / 2 - left
    y = (size - (bottom - top)) / 2 - top
    d.text((x, y), GLYPH, font=font, fill=PAPER)
    img.save((dest or OUT) / name, optimize=True)


if __name__ == "__main__":
    make(192, "icon-192.png", 0.15)
    make(512, "icon-512.png", 0.15)
    make(512, "icon-maskable-512.png", 0.26)
    make(180, "apple-touch-icon.png", 0.14)
    make(32, "favicon-32.png", 0.10, ROOT)
    print("icons ->", OUT, "| favicon ->", ROOT)
