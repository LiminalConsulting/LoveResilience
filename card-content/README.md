# Card Content System

This directory contains individual markdown files for each card in the Love Resilience deck.

## File Structure

Each card is stored as a separate markdown file with YAML frontmatter:

```markdown
---
number: 1
name: "Accept yourself"
theme: ""
image: "1_accept yourself.jpg"
---

# Meaning
[Card meaning text]

# Question
[Reflective questions]

# Action
[Action steps]

# Quote
> "Quote text"
> — Author
```

## Naming Convention

Files are named: `{number}_{name}.md`

Examples:
- `01_accept_yourself.md`
- `10_change.md`
- `25_grounding.md`

## Generating the Client Document

To generate the complete DOCX document with all cards and embedded images:

```bash
python generate_client_document.py
```

This creates `LoveResilience_CardDeck_Complete.docx` which:
- Can be opened and edited in Apple Pages
- Contains all card images embedded (no external files needed)
- Is formatted with proper headings and structure
- Is parseable by the website (can extract text/images programmatically)

## Adding New Cards

1. Create a new markdown file in this directory
2. Follow the template above
3. Run the generation script to include it in the document

## Website Integration

The markdown files in this directory are also designed to be parsed by the website code for displaying card content online. The structure is intentionally kept simple and consistent for easy parsing.
