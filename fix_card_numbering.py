#!/usr/bin/env python3
"""
Fix card numbering offset caused by empty 'Gift' row in PDF.

Problem: PDF had empty row for "Gift" as card 24, but actual card 24 is "Gratitude"
Solution:
  - Delete 24_gift.md (empty placeholder)
  - Renumber cards 25-66 to 26-67
  - Keep 24_gratitude.md as is (correct)
"""

import re
from pathlib import Path
import shutil

def main():
    cards_dir = Path('card-content')

    print("="*80)
    print("FIXING CARD NUMBERING OFFSET")
    print("="*80)
    print()

    # Step 1: Delete the empty Gift placeholder
    gift_file = cards_dir / '24_gift.md'
    if gift_file.exists():
        print(f"🗑️  Deleting empty placeholder: {gift_file.name}")
        gift_file.unlink()
    else:
        print(f"⚠️  24_gift.md not found (already deleted?)")

    print()
    print("Renumbering cards 25-66 to 26-67...")
    print("-" * 80)

    # Step 2: Renumber cards from HIGH to LOW to avoid conflicts
    # Start at 66 and work backwards to 25
    renamed_count = 0

    for old_num in range(66, 24, -1):  # 66, 65, 64, ..., 25
        new_num = old_num + 1

        # Find all files starting with this number
        pattern = f"{old_num:02d}_*.md"
        matching_files = list(cards_dir.glob(pattern))

        for old_file in matching_files:
            # Create new filename with incremented number
            new_filename = re.sub(
                r'^(\d+)_',
                f'{new_num:02d}_',
                old_file.name
            )
            new_file = cards_dir / new_filename

            # Also update the number in the frontmatter
            with open(old_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Update number in YAML frontmatter
            content = re.sub(
                r'^number: \d+',
                f'number: {new_num}',
                content,
                flags=re.MULTILINE
            )

            # Write to new location
            with open(new_file, 'w', encoding='utf-8') as f:
                f.write(content)

            # Delete old file
            old_file.unlink()

            print(f"✓ {old_file.name:45s} → {new_filename}")
            renamed_count += 1

    print()
    print("="*80)
    print(f"✅ COMPLETE: Renamed {renamed_count} files")
    print("="*80)
    print()
    print("Cards 1-24 unchanged (correct)")
    print("Cards 25-66 → 26-67 (shifted by +1)")
    print("Empty 24_gift.md deleted")
    print()
    print("Next step: Regenerate the DOCX document")

if __name__ == '__main__':
    main()
