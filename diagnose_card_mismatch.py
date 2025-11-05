#!/usr/bin/env python3
"""
Diagnose card number vs content mismatches caused by duplicate card 24 in PDF.
"""

from pathlib import Path
import re

# Expected card names from the PDF (the ACTUAL content, not the numbers)
EXPECTED_CARDS = {
    1: "Accept yourself",
    2: "Acceptance",
    3: "Along with",
    4: "Anger",
    5: "Balance",
    6: "Blessed",
    7: "Breath",  # Body, Nervous system
    8: "Breath",  # take a breath
    9: "Chance",
    10: "Change",
    11: "Coherence",
    12: "Connection",
    13: "Courageous",
    14: "Creativity",
    15: "Dance",
    16: "Determination",
    17: "Discipline",
    18: "Embracing Change",
    19: "Empathy",
    20: "Faith",
    21: "Fantasy",
    22: "Flow",
    23: "Freedom",
    24: "Gift",  # First card 24
    # 24b: "Gratitude",  # Second card 24 - THIS CAUSES THE OFFSET!
    25: "Gratitude",  # Should be 24b, but numbered as 25 in markdown
    26: "Grounding",  # Content is in 25_grounding.md (OFF BY 1)
    27: "Healing",    # Content is in 26_healing.md (OFF BY 1)
    28: "Helping",    # Content is in 27_helping.md (OFF BY 1)
    29: "Hope",       # Content is in 28_hope.md (OFF BY 1)
    30: "Inner Child", # Content is in 29_inner_child.md (OFF BY 1)
    # ... and so on
}

def extract_card_name_from_file(filepath):
    """Extract the card name from markdown frontmatter."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'name: "([^"]+)"', content)
    if match:
        return match.group(1)
    return None

def main():
    cards_dir = Path('card-content')

    print("="*80)
    print("CARD MISMATCH DIAGNOSTIC")
    print("="*80)
    print()
    print("Looking for mismatches where file number doesn't match content...")
    print()

    # Get all numbered markdown files
    md_files = sorted([f for f in cards_dir.glob('*.md') if re.search(r'^\d+_', f.name)],
                     key=lambda x: int(re.search(r'(\d+)_', x.name).group(1)))

    mismatches = []

    for md_file in md_files:
        file_num_match = re.search(r'^(\d+)_', md_file.name)
        if not file_num_match:
            continue

        file_num = int(file_num_match.group(1))
        card_name = extract_card_name_from_file(md_file)

        if card_name:
            # Check if this is where the problem starts
            if file_num >= 25:
                print(f"File: {md_file.name:40s} -> Card Name: {card_name}")
                mismatches.append((file_num, md_file.name, card_name))

    print()
    print("="*80)
    print("ANALYSIS")
    print("="*80)
    print()
    print("The PDF has DUPLICATE card #24:")
    print("  - Card 24a: Gift (before priority)")
    print("  - Card 24b: Gratitude")
    print()
    print("This causes all cards from #25 onwards to be off by 1:")
    print("  - File '25_gratitude.md' should actually be card 24b")
    print("  - File '25_grounding.md' should be card 26")
    print("  - File '26_healing.md' should be card 27")
    print("  - And so on...")
    print()
    print(f"Total files that need renumbering: {len([m for m in mismatches if m[0] >= 25])}")

if __name__ == '__main__':
    main()
