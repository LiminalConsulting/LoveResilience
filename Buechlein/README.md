# Love Resilience — Büchlein (Begleitbuch)

Word template for the printed companion booklet that goes with Tanja's Love Resilience card deck. Built 2026-05-12 in response to Tanja's email forwarding the printer's layout spec.

## The deliverable

**`LoveResilience-Buechlein-Vorlage.docx`** — empty Word template Tanja pastes/types her booklet text into, then exports as PDF for the printer.

## Printer's spec (Tanja's print shop, German trade printer)

- Final size: **85 × 125 mm**
- Margins: **15 mm Bund (spine/inside)**, **10 mm** outside, top, bottom
- Satzspiegel (text area): 60 × 105 mm
- Mirror margins (left page mirrors right page)
- Target page count: **~200 pages max** — font size to be chosen based on text volume
- Final delivery to printer: **PDF at exactly the final 85×125 mm format**
- Printer is building the cover (Umschlag) separately — booklet template is interior pages only

## What's baked into the template

- Page size 85 × 125 mm, mirror margins set per spec
- Body style: **Cambria 10 pt**, Blocksatz (justified), 1.15 line spacing, 3 mm first-line indent
- Document language **de-DE** → automatic German hyphenation
- `autoHyphenation`, `doNotHyphenateCaps`, max 3 consecutive hyphens
- `evenAndOddHeaders` enabled (in case running heads are added later)
- Two starter paragraphs explaining the layout — Tanja deletes them when she pastes her text

## How it was built

`python-docx` script — see `build_booklet_template.py` in this folder. To rebuild or tweak: `python3 build_booklet_template.py` (requires `python-docx` — install with `pip3 install --user --break-system-packages python-docx`). The script writes the .docx directly and gives precise control over Word's XML (mirror margins, hyphenation flags, language tags). Pandoc was *not* used — it ignores Word page setup when round-tripping.

To verify the .docx XML is correct without opening Word:
```bash
unzip -p LoveResilience-Buechlein-Vorlage.docx word/document.xml | grep -o 'pgSz[^/]*\|pgMar[^/]*\|mirrorMargins'
unzip -p LoveResilience-Buechlein-Vorlage.docx word/settings.xml  | grep -o 'autoHyphenation\|hyphenationZone[^/]*'
```

Expected: `pgSz w:w="4819" h="7087"` (85×125 mm), `pgMar left=850 right=567 top=567 bottom=567` (15/10/10/10 mm), `mirrorMargins` present, `autoHyphenation` present.

## Open questions Tanja hasn't answered yet

These didn't block delivery of the empty template, but if/when she comes back wanting more polish, they're the next decisions:

1. **Does she already have the booklet text written somewhere?** If yes, doing the layout for her in one shot is probably more useful than the empty template.
2. **Structure:** chapter headings? Title page? Automatic page numbers? Table of contents? Currently: none of these — just body text.
3. **Font preference:** Cambria is the default. She may want something more distinctive once she sees the deck's overall aesthetic. Easy to swap.
4. **Running heads / pagination style:** book-typical odd-page-right pagination, chapter name in header, etc. — none of this set up yet.

## Related

- Digital card deck: the parent repo (this folder lives inside it), hosted at https://liminalconsulting.github.io/LoveResilience/. The booklet and the digital deck are companion pieces of the same Love Resilience product.
- Tanja's role: Geschäftsführerin, building the physical deck + booklet for her coaching practice; David is helping with the digital/typography side
