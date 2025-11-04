#!/usr/bin/env python3
"""
Fix image links in markdown files to match actual image filenames.
"""

import re
from pathlib import Path

# Mapping of card numbers to actual image filenames
IMAGE_MAP = {
    0: "0_let_the_light_in.jpg",
    1: "1_accept yourself.jpg",
    2: "2_acceptance.jpg",
    3: "3_along with_SUPPORT.jpg",
    4: "4_anger.jpg",
    5: "5_balance_POSITIVE EMOTIONS.jpg",
    6: "6_blessed.jpg",
    7: "7_breath_LETTING GO.jpg",
    8: "8_breath.jpg",
    9: "9_chance.jpg",
    10: "10_change.jpg",
    11: "11_coherence_POSITIVE EMOTIONS.jpg",
    12: "12_connection_SOCIAL SUPPORT.jpg",
    13: "13_courageous.jpg",
    14: "14_creativity.jpg",
    15: "15_dance.jpg",
    16: "16_determination.jpg",
    17: "17_discipline.jpg",
    18: "18_embracing change.jpg",
    19: "19_empathy.jpg",
    20: "20_faith.jpg",
    21: "21_fantasy_PURPOSE.jpg",
    22: "22_flow_SELF EFFICIENCY.jpg",
    23: "23_freedom_PURPOSE.jpg",
    24: "24_gratitude.jpg",
    25: "25_grounding_IMPULSE CONTROL.jpg",
    26: "26_healing_LETTING GO.jpg",
    27: "27_helping_SOCIAL SUPPORT.jpg",
    28: "28_hope.jpg",
    29: "29_inner child_IMPULSE CONTROL.jpg",
    30: "30_intuition_PATTERNS.jpg",
    31: "31_inward moment_IMPULSE CONTROL.jpg",
    32: "32_joy.jpg",
    33: "33_kintsugi_SELF EFFICIENCY.jpg",
    34: "34_let it go_LETTING GO.jpg",
    35: "35_let the light in_POSITIVE EMOTIONS.jpg",
    36: "36_lightness_DISTANCE OF SELF.jpg",
    37: "37_listen to your heart_SELF LOVE.jpg",
    38: "38_magic in you_CREATIVITY_SELF EFFICIENCY.jpg",
    39: "39_me time_SAFE PLACE.jpg",
    40: "40_mindset_REALISTIC OPTIMISM.jpg",
    41: "41_mountain_COURAGE.jpg",
    42: "42_music.jpg",
    43: "43_oceans of emotions.jpg",
    44: "44_paradise.jpg",
    45: "45_paths.jpg",
    46: "46_precious.jpg",
    47: "47_priority_DISCIPLINE_CAUSAL ANALYSIS.jpg",
    48: "48_protection_SELF LOVE.jpg",
    49: "49_purpose_PURPOSE.jpg",
    50: "50_quality time_SOCIAL SUPPORT.jpg",
    51: "51_reflecting_CAUSAL ANALYSIS.jpg",
    52: "52_rejuvenate_SERVING & HELPING.jpg",
    53: "53_rest_DISCIPLINE.jpg",
    54: "54_rise_PURPOSE.jpg",
    55: "55_safe place_RESPONSIBILTY.jpg",
    56: "56_self love_DISTANCE OF SELF.jpg",
    57: "57_self love_SELF LOVE.jpg",
    58: "58_sense of humor.jpg",
    59: "59_setting boundaries.jpg",
    60: "60_sistermoon_EMBRACING CHANGE.jpg",
    61: "61_solution orientation.jpg",
    62: "62_stability_DISCIPLINE.jpg",
    63: "63_strength_TRUSTING LIFE.jpg",
    64: "64_support.jpg",
    65: "65_time alone_SELF LOVE.jpg",
    66: "66_trusting life.jpg",
    67: "67_unconditional love_SOCIAL SUPPORT.jpg",
    68: "68_vulnerability.jpg",
    69: "69_your path_SELF LOVE.jpg",
}

def fix_markdown_file(filepath):
    """Fix the image reference in a markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract card number from filename
    match = re.search(r'^(\d+)_', filepath.name)
    if not match:
        print(f"Skipping {filepath.name} - no number found")
        return False

    card_num = int(match.group(1))

    if card_num not in IMAGE_MAP:
        print(f"⚠️  {filepath.name} - No image mapping for card {card_num}")
        return False

    correct_image = IMAGE_MAP[card_num]

    # Replace the image line in frontmatter
    new_content = re.sub(
        r'image: "[^"]*"',
        f'image: "{correct_image}"',
        content
    )

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✓ Fixed {filepath.name} -> {correct_image}")
        return True
    else:
        print(f"  {filepath.name} - already correct")
        return False

def main():
    cards_dir = Path('card-content')

    print("="*60)
    print("Fixing Image References in Card Markdown Files")
    print("="*60)
    print()

    fixed_count = 0

    # Get all numbered markdown files
    md_files = sorted([f for f in cards_dir.glob('*.md') if re.search(r'^\d+_', f.name)],
                     key=lambda x: int(re.search(r'(\d+)_', x.name).group(1)))

    for md_file in md_files:
        if fix_markdown_file(md_file):
            fixed_count += 1

    print()
    print(f"Fixed {fixed_count} files")
    print()

if __name__ == '__main__':
    main()
