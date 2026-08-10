"""Extract reusable transparent motion assets from the approved raster references."""

from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def paper_alpha(image: Image.Image, keep_dark: bool = True, keep_gold: bool = True) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = []
    for red, green, blue, _ in rgba.getdata():
        brightness = (red + green + blue) / 3
        chroma = max(red, green, blue) - min(red, green, blue)
        dark = 255 - brightness
        gold = max(0, red - blue) + max(0, green - blue)
        alpha = 0
        if keep_dark:
            alpha = max(alpha, int(max(0, dark - 16) * 2.25))
        if keep_gold:
            alpha = max(alpha, int(max(0, gold - 10) * 1.55))
        if chroma > 22:
            alpha = max(alpha, int(min(255, chroma * 3.2)))
        pixels.append((red, green, blue, min(255, alpha)))
    rgba.putdata(pixels)
    return rgba


def crop_note(source: Image.Image, box: tuple[int, int, int, int], name: str) -> None:
    note = paper_alpha(source.crop(box), keep_dark=True, keep_gold=False)
    alpha = note.getchannel("A").filter(ImageFilter.GaussianBlur(0.45))
    note.putalpha(alpha)
    note.save(PUBLIC / name)


severance = Image.open(PUBLIC / "severance-background-selected.png")

# Gold burst and colored confetti only; green notes are animated separately.
burst = severance.convert("RGBA")
burst_pixels = []
for red, green, blue, _ in burst.getdata():
    brightness = (red + green + blue) / 3
    gold = max(0, red - blue) + max(0, green - blue)
    colorful = max(red, green, blue) - min(red, green, blue)
    green_note = green > red * 0.96 and green > blue * 1.08 and brightness < 225
    gold_alpha = max(max(0, gold - 7) * 2.15, max(0, 250 - blue) * 5.0)
    color_alpha = max(0, colorful - 24) * 3.1
    alpha = int(min(225, max(gold_alpha, color_alpha)))
    if green_note:
        alpha = 0
    burst_pixels.append((red, green, blue, alpha))
burst.putdata(burst_pixels)
burst.save(PUBLIC / "severance-burst.png")

note_boxes = [
    (118, 72, 315, 270),
    (568, 0, 804, 252),
    (648, 332, 852, 520),
    (0, 520, 205, 740),
    (664, 580, 852, 795),
    (32, 760, 224, 1005),
    (610, 760, 850, 1015),
    (0, 1260, 266, 1618),
    (645, 1250, 853, 1535),
]
for index, box in enumerate(note_boxes, start=1):
    crop_note(severance, box, f"money-note-{index}.png")

pending = Image.open(PUBLIC / "pending-background-selected.png")
pending_fx = paper_alpha(pending, keep_dark=True, keep_gold=False)
pending_fx.save(PUBLIC / "pending-burst-calendars.png")

pending_reference = Image.open(PUBLIC / "design-references" / "pending-selected.png")
calendar_boxes = [
    (622, 500, 795, 720),
    (0, 855, 205, 1085),
    (650, 870, 853, 1095),
]
calendar_polygons = [
    [(18, 42), (137, 18), (171, 163), (27, 195), (0, 177)],
    [(4, 72), (78, 24), (180, 92), (147, 173), (16, 151)],
    [(22, 63), (83, 21), (190, 78), (164, 174), (35, 157)],
]
for index, box in enumerate(calendar_boxes, start=1):
    calendar = paper_alpha(pending_reference.crop(box), keep_dark=True, keep_gold=False)
    alpha = calendar.getchannel("A").filter(ImageFilter.GaussianBlur(0.35))
    shape_mask = Image.new("L", calendar.size, 0)
    ImageDraw.Draw(shape_mask).polygon(calendar_polygons[index - 1], fill=255)
    shape_mask = shape_mask.filter(ImageFilter.GaussianBlur(1.0))
    calendar.putalpha(ImageChops.multiply(alpha, shape_mask))
    calendar.save(PUBLIC / f"pending-calendar-{index}.png")
