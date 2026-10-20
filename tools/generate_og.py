#!/usr/bin/env python3
"""Generate the social preview card and app icons.

Optional tooling: requires Pillow (``pip install pillow``).
Run from the repository root: ``python3 tools/generate_og.py``
"""
from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"

BONE = "#EDE6D7"
INK = "#1C1A16"
MUTED = "#6B6558"
TERRACOTTA = "#B46544"
SAGE = "#6E7B63"
SAND = "#D8C6A6"

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default(size=size)


def spaced(draw: ImageDraw.ImageDraw, xy, text: str, fnt, fill, tracking=2) -> None:
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking


def og_card() -> None:
    random.seed(7)
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), BONE)
    d = ImageDraw.Draw(img)

    # paper grain
    for _ in range(1400):
        x, y = random.randrange(w), random.randrange(h)
        d.point((x, y), fill="#DED5C3")

    # drafting grid
    for x in range(0, w, 60):
        d.line([(x, 0), (x, h)], fill="#DCD3C1", width=1)
    for y in range(0, h, 60):
        d.line([(0, y), (w, y)], fill="#DCD3C1", width=1)

    # border
    d.rectangle([26, 26, w - 27, h - 27], outline=(28, 26, 22, 60), width=1)

    # architectural composition, right
    d.rectangle([760, 96, 1120, 536], fill=SAND)
    d.rectangle([760, 96, 1120, 536], outline=INK, width=3)
    d.pieslice([820, 210, 1000, 390], 180, 360, fill=TERRACOTTA)
    d.rectangle([820, 300, 1000, 536], fill=TERRACOTTA)
    d.pieslice([860, 260, 960, 360], 180, 360, fill=SAND)
    d.rectangle([860, 310, 960, 536], fill=SAND)
    d.line([(860, 310), (860, 536)], fill=TERRACOTTA, width=3)
    d.line([(960, 310), (960, 536)], fill=TERRACOTTA, width=3)
    d.ellipse([1046, 132, 1106, 192], fill=TERRACOTTA)
    for y in range(420, 536, 22):
        d.line([(1010, y), (1120, y)], fill=INK, width=1)
    d.line([(760, 536), (1120, 536)], fill=INK, width=4)
    d.line([(760, 96), (1120, 96)], fill=INK, width=6)

    # foliage
    d.ellipse([706, 430, 786, 510], fill=SAGE)
    d.ellipse([728, 404, 792, 468], fill="#7E8B70")
    d.rectangle([744, 486, 754, 560], fill="#4B3E2C")

    # typography
    spaced(d, (70, 72), "PORTFOLIO / 2025", font(MONO, 15), MUTED, 3)
    display = font(SERIF, 94)
    d.text((66, 116), "Edith", font=display, fill=INK)
    d.text((66, 216), "Nduta", font=display, fill=INK)
    kuria_x = 66 + d.textlength("Nduta", font=display) + 26
    d.text((kuria_x, 216), "Kuria", font=display, fill=TERRACOTTA)
    d.line([(70, 340), (600, 340)], fill=(28, 26, 22, 70), width=1)
    d.text((70, 366), "Architect — Nairobi, Kenya", font=font(SERIF, 30), fill=INK)
    d.text(
        (70, 414),
        "Climate-responsive spaces, adaptive reuse\nand the quiet life of buildings.",
        font=font(MONO, 17),
        fill=MUTED,
        spacing=10,
    )
    spaced(d, (70, 520), "B.ARCH, JKUAT 2025   /   LOCUS STUDIO", font(MONO, 14), MUTED, 2)
    d.text((70, 558), "edithnduta.studio", font=font(MONO, 14), fill=TERRACOTTA)

    img.save(IMG / "og.png", optimize=True)
    print("wrote assets/img/og.png")


def icon(size: int, path: Path) -> None:
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, s, s], fill=INK)

    # arch
    m = int(s * 0.24)
    arch_w = s - 2 * m
    top = int(s * 0.22)
    bottom = s - m
    radius = arch_w // 2
    d.rounded_rectangle(
        [m, top, s - m, bottom],
        radius=radius,
        outline=BONE,
        width=max(2, int(s * 0.055)),
    )
    d.rectangle([m, top + radius, s - m, bottom], fill=INK)
    d.rounded_rectangle(
        [m, top, s - m, bottom],
        radius=radius,
        outline=BONE,
        width=max(2, int(s * 0.055)),
    )
    # sun
    r = int(s * 0.075)
    cx, cy = int(s * 0.72), int(s * 0.28)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=TERRACOTTA)
    # ground line
    d.line(
        [(m, bottom), (s - m, bottom)],
        fill=BONE,
        width=max(2, int(s * 0.045)),
    )

    img = img.resize((size, size), Image.LANCZOS)
    img.save(path, optimize=True)
    print(f"wrote {path.relative_to(ROOT)}")


def main() -> None:
    og_card()
    icon(512, IMG / "icon-512.png")
    icon(192, IMG / "icon-192.png")
    icon(180, IMG / "apple-touch-icon.png")


if __name__ == "__main__":
    main()
