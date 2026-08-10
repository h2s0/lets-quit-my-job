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
    green_note = (
        green >= red * 0.92
        and green > blue * 1.03
        and green - red > -8
        and red - blue < 45
        and brightness < 253
    )
    gray_note_detail = colorful < 28 and brightness < 205
    gold_alpha = max(max(0, gold - 7) * 2.15, max(0, 250 - blue) * 5.0)
    color_alpha = max(0, colorful - 24) * 3.1
    alpha = int(min(225, max(gold_alpha, color_alpha)))
    if green_note or gray_note_detail:
        alpha = 0
    burst_pixels.append((red, green, blue, alpha))
burst.putdata(burst_pixels)
# The reference also contains photographed banknotes. They are rendered as
# independent animated layers, so remove every note-shaped region from the
# otherwise-static burst to avoid frozen duplicates between animation loops.
note_erase = Image.new("L", severance.size, 255)
note_draw = ImageDraw.Draw(note_erase)
static_note_polygons = [
    [(548, 0), (741, 0), (761, 130), (594, 244), (553, 204)],
    [(162, 113), (300, 118), (276, 225), (177, 234), (151, 193)],
    [(0, 194), (70, 205), (110, 263), (0, 326)],
    [(660, 357), (802, 345), (842, 467), (693, 489)],
    [(795, 440), (853, 454), (853, 591), (772, 631), (758, 561)],
    [(0, 565), (180, 618), (154, 714), (0, 675)],
    [(785, 486), (853, 475), (853, 637), (768, 640)],
    [(0, 633), (80, 642), (71, 730), (0, 713)],
    [(659, 645), (853, 622), (853, 767), (718, 756)],
    [(0, 728), (144, 742), (130, 883), (0, 890)],
    [(35, 751), (132, 732), (158, 832), (50, 861)],
    [(109, 846), (229, 863), (197, 935), (92, 919)],
    [(283, 865), (414, 847), (421, 929), (302, 947)],
    [(558, 856), (695, 839), (706, 931), (569, 950)],
    [(681, 879), (838, 860), (853, 983), (715, 1011)],
    [(34, 917), (234, 920), (246, 1052), (75, 1075)],
    [(561, 930), (653, 910), (671, 1001), (575, 1025)],
    [(699, 951), (853, 958), (853, 1084), (724, 1065)],
    [(747, 1047), (853, 1064), (853, 1245), (763, 1227)],
    [(0, 1241), (124, 1228), (246, 1478), (93, 1558), (0, 1461)],
    [(675, 1273), (853, 1324), (853, 1513), (676, 1448)],
    [(797, 1660), (853, 1669), (853, 1856), (803, 1856)],
]
for polygon in static_note_polygons:
    note_draw.polygon(polygon, fill=0)
note_erase = note_erase.filter(ImageFilter.GaussianBlur(4.0))
burst.putalpha(ImageChops.multiply(burst.getchannel("A"), note_erase))
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
pending_alpha = pending_fx.getchannel("A")
calendar_erase = Image.new("L", pending.size, 255)
erase_draw = ImageDraw.Draw(calendar_erase)
erase_draw.polygon([(635, 535), (760, 505), (810, 660), (650, 710), (605, 680)], fill=0)
erase_draw.polygon([(0, 910), (75, 855), (210, 945), (160, 1085), (0, 1035)], fill=0)
erase_draw.polygon([(638, 930), (735, 860), (853, 925), (853, 1060), (675, 1090)], fill=0)
calendar_erase = calendar_erase.filter(ImageFilter.GaussianBlur(2.0))
pending_fx.putalpha(ImageChops.multiply(pending_alpha, calendar_erase))
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
