#!/usr/bin/env python3
"""
Parse Karten_Final.pdf table and generate individual markdown files for each card.
Preserves blank/incomplete entries so client can see what's missing.
"""

import re
import os
from pathlib import Path
from pypdf import PdfReader

def clean_text(text):
    """Clean up text by removing extra whitespace and normalizing."""
    if not text:
        return ""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_card_name_from_line(line):
    """Extract card name from table row (usually highlighted in green)."""
    # Card names are typically in column after number
    # Pattern: Number. Name ...
    match = re.match(r'^\d+\.\s+([A-Za-z\s\(\)]+)', line)
    if match:
        return clean_text(match.group(1))
    return ""

def parse_pdf_table(pdf_path):
    """
    Parse the PDF table and extract card information.
    Returns a list of card dictionaries.
    """
    reader = PdfReader(pdf_path)
    cards = []

    print(f"Reading PDF: {pdf_path}")
    print(f"Total pages: {len(reader.pages)}")

    # Extract text from all pages
    full_text = ""
    for page_num, page in enumerate(reader.pages, 1):
        text = page.extract_text()
        full_text += f"\n--- PAGE {page_num} ---\n{text}"

    # Save full text for inspection
    with open('pdf_extracted_text.txt', 'w', encoding='utf-8') as f:
        f.write(full_text)
    print("Saved extracted text to: pdf_extracted_text.txt")

    # Split into lines for table parsing
    lines = full_text.split('\n')

    current_card = None
    card_number = 0

    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue

        # Look for card number pattern at start of line
        # Pattern: "1." or "10." etc
        num_match = re.match(r'^(\d+)\.\s+(.+)', line)
        if num_match:
            # Save previous card if exists
            if current_card and current_card.get('name'):
                cards.append(current_card)

            # Start new card
            card_number = int(num_match.group(1))
            rest_of_line = num_match.group(2)

            current_card = {
                'number': card_number,
                'name': '',
                'theme': '',
                'meaning': '',
                'question': '',
                'action': '',
                'quotes': [],
                'notes': ''
            }

            # Extract name from rest of line (before "Meaning:")
            name_match = re.search(r'^([^M]+?)(?:\s+Meaning:|$)', rest_of_line)
            if name_match:
                current_card['name'] = clean_text(name_match.group(1))

        # Look for section markers
        if current_card:
            # Meaning section
            if 'Meaning:' in line or line.startswith('Meaning'):
                meaning_text = re.sub(r'^.*?Meaning:\s*', '', line)
                current_card['meaning'] += ' ' + meaning_text

            # Question section
            elif 'Question:' in line or line.startswith('Question'):
                question_text = re.sub(r'^.*?Question:\s*', '', line)
                current_card['question'] += ' ' + question_text

            # Action section
            elif 'Action:' in line or line.startswith('Action'):
                action_text = re.sub(r'^.*?Action:\s*', '', line)
                current_card['action'] += ' ' + action_text

            # Quote detection (lines starting with " or —)
            elif line.startswith('"') or line.startswith('—') or line.startswith('-'):
                current_card['quotes'].append(line)

    # Don't forget the last card
    if current_card and current_card.get('name'):
        cards.append(current_card)

    return cards

def find_matching_image(card_name, card_number, images_dir):
    """Find the matching image file for a card."""
    images_dir = Path(images_dir)

    # Try different filename patterns
    patterns = [
        f"{card_number}_{card_name.lower().replace(' ', '_')}.jpg",
        f"{card_number}_{card_name.lower().replace(' ', '_')}.png",
        f"{card_number}_{card_name.replace(' ', '_')}.jpg",
        f"{card_number}*.jpg",  # Wildcard match
    ]

    for pattern in patterns:
        matches = list(images_dir.glob(pattern))
        if matches:
            return matches[0].name

    # If no match found, return generic pattern
    return f"{card_number}_{card_name.lower().replace(' ', '_')}.jpg"

def create_markdown_file(card, output_dir, images_dir):
    """Create a markdown file for a single card."""
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)

    # Clean up card data
    card['meaning'] = clean_text(card.get('meaning', ''))
    card['question'] = clean_text(card.get('question', ''))
    card['action'] = clean_text(card.get('action', ''))

    # Find matching image
    image_filename = find_matching_image(
        card['name'],
        card['number'],
        images_dir
    )

    # Create filename
    filename = f"{card['number']:02d}_{card['name'].lower().replace(' ', '_').replace('(', '').replace(')', '')}.md"
    filepath = output_dir / filename

    # Build markdown content
    content = f"""---
number: {card['number']}
name: "{card['name']}"
theme: "{card.get('theme', '')}"
image: "{image_filename}"
---

# Meaning

{card['meaning'] if card['meaning'] else '[Content to be added]'}

# Question

{card['question'] if card['question'] else '[Content to be added]'}

# Action

{card['action'] if card['action'] else '[Content to be added]'}

# Quote

"""

    # Add quotes if present
    if card.get('quotes'):
        for quote in card['quotes']:
            content += f"{quote}\n"
    else:
        content += "[Quote to be added]\n"

    # Write file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

    return filepath

def main():
    """Main execution function."""
    PDF_PATH = 'Karten_Final.pdf'
    OUTPUT_DIR = 'card-content'
    IMAGES_DIR = 'public/CardSet'

    print("="*60)
    print("Love Resilience Card Deck - PDF Parser")
    print("="*60)

    # Parse PDF
    cards = parse_pdf_table(PDF_PATH)
    print(f"\nExtracted {len(cards)} cards from PDF")

    # Create markdown files
    print(f"\nGenerating markdown files in {OUTPUT_DIR}/")
    created_files = []

    for card in cards:
        try:
            filepath = create_markdown_file(card, OUTPUT_DIR, IMAGES_DIR)
            created_files.append(filepath)
            status = "✓" if (card['meaning'] or card['question'] or card['action']) else "○"
            print(f"  {status} {filepath.name}")
        except Exception as e:
            print(f"  ✗ Error creating card {card.get('number', '?')}: {e}")

    print(f"\nCreated {len(created_files)} markdown files")
    print(f"\nNote: ✓ = has content, ○ = placeholder (needs content)")
    print("\nNext step: Run 'python generate_client_document.py' to create the DOCX")

if __name__ == '__main__':
    main()
