"""Create normalized Visual Ralph pixel-diff evidence.

Usage: python scripts/visual_diff.py <reference-dir> <capture-dir> <output-dir>
Requires Pillow (`python -m pip install Pillow`).
"""

from pathlib import Path
import sys

from PIL import Image, ImageChops, ImageEnhance, ImageStat


TARGET_WIDTH = 390


def normalize(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")
    height = round(image.height * TARGET_WIDTH / image.width)
    return image.resize((TARGET_WIDTH, height), Image.Resampling.LANCZOS)


def pad(image: Image.Image, height: int) -> Image.Image:
    canvas = Image.new("RGB", (TARGET_WIDTH, height), "white")
    canvas.paste(image, (0, 0))
    return canvas


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("usage: visual_diff.py <reference-dir> <capture-dir> <output-dir>")

    reference_dir, capture_dir, output_dir = map(Path, sys.argv[1:])
    output_dir.mkdir(parents=True, exist_ok=True)
    scores: list[str] = []

    for reference_path in sorted(reference_dir.glob("*.png")):
        capture_path = capture_dir / reference_path.name
        if not capture_path.exists():
            continue

        reference = normalize(Image.open(reference_path))
        capture = normalize(Image.open(capture_path))
        height = max(reference.height, capture.height)
        reference = pad(reference, height)
        capture = pad(capture, height)
        difference = ImageChops.difference(reference, capture)
        emphasized = ImageEnhance.Contrast(difference).enhance(2.5)
        emphasized.save(output_dir / f"{reference_path.stem}-diff.png")

        mean = sum(ImageStat.Stat(difference).mean) / 3
        similarity = max(0.0, 100.0 * (1.0 - mean / 255.0))
        scores.append(f"{reference_path.stem}: {similarity:.2f}")

    (output_dir / "pixel-similarity.txt").write_text("\n".join(scores) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
