# Love Resilience Client Document - Specifications

## Project Overview
**Client:** Tanja
**Purpose:** Create an editable reference document containing all card deck content with integrated card images
**Source Materials:**
- Karten_Final.pdf (card text content)
- CardSet folder (70 card images)
- Development session transcript

## Document Requirements (from Transcript)

### Key Requirements Extracted from Conversation:

1. **Image Integration**
   - "creating this document for my client which should be based on the existing PDF"
   - "adding of the images into it"
   - "have it be something that like ideally a pages document"
   - "having it with these pictures inside and the correct way"

2. **Editability**
   - Must be editable in Apple Pages
   - Client needs to modify/update text
   - "have it be editablwith these pictures inside"

3. **AI-Parseable**
   - "it should also be possible like it should be able to be passed by you past that is like two parse a file"
   - Needs clear structure for AI to understand

4. **Card Image Format**
   - Small format images embedded in document
   - "in this Text, den ich dir jetzt geschickt habe, auch die Karten in Kleinformat dazu machen kann"
   - "die Karte immer noch mal in Kleinformat dabei"
   - Shows which card is being discussed

5. **Purpose**
   - Reference for client (Tanja)
   - Communication tool with designer (Ekin)
   - "dann kann ich auch mit der Designerin noch mal sprechen, dann weiß sie auch immer von was ich spreche"
   - "für meinen Überblick sozusagen noch mal ein bisschen optimieren"

## Content Structure

Each card entry should include:

1. **Card Image** (small format, from CardSet folder)
2. **Card Number**
3. **Card Name** (e.g., "Accept Yourself", "Acceptance", etc.)
4. **Factor/Theme** (if applicable)
5. **Meaning** (full descriptive text)
6. **Question** (reflection questions)
7. **Action** (action steps)
8. **Quotes** (inspirational quotes)
9. **Notes/Changes** (design notes, if any)

## Missing Elements for Future Updates

From the transcript, client still needs to provide:
1. "Wing element asset from 'Let the Light In' card" - for welcome screen
2. "Shuffle animation implementation" - for app functionality
3. "Card text content from PDF" - some cards may have incomplete text

## Today's Message & Intention Fields

From transcript discussion:
- These should be part of card data
- AI can generate suggestions based on existing text
- Client will review and edit
- Should be "ein Satz sein oder zwei jeweils" (one or two sentences each)

## Cards Mentioned in Transcript

Specific cards discussed:
- **Let the Light In (Card 0)** - Wing/Kintsugi card, used for cover and welcome screen
- **Time Alone** - Has three sections: Meaning, Question, Action
- Various numbered cards 1-70

## Format Recommendations

### Optimal File Format: RTF (Rich Text Format)
**Why RTF:**
- ✅ Opens natively in Apple Pages
- ✅ Fully editable (text and images)
- ✅ Preserves formatting
- ✅ Can be parsed by AI tools
- ✅ Cross-platform compatible
- ✅ Supports embedded images

### Alternative: Markdown with Images
**Why Markdown:**
- ✅ Clean, simple structure
- ✅ AI-friendly parsing
- ✅ Version control friendly
- ✅ Can be converted to other formats
- ⚠️ Requires conversion to open in Pages

### Not Recommended: Pure PDF
- ❌ Not easily editable
- ❌ Difficult to modify images

## Implementation Notes

### Image Handling:
```
For each card:
  - Locate image in public/CardSet/
  - Resize to small format (e.g., 200px width)
  - Embed inline with card text
  - Maintain aspect ratio
```

### Text Formatting:
```
Card Name: Bold, larger font
Sections: Clear headings (Meaning, Question, Action)
Quotes: Italicized, indented
Notes: Smaller font, distinct color
```

### Organization:
- Alphabetical by card name (as in PDF)
- Or numerical by card number
- Consistent spacing between cards
- Page breaks where appropriate

## Client Workflow

1. Client receives editable document
2. Reviews all card content
3. Adds/modifies text as needed
4. Shares with designer (Ekin) for visual reference
5. Uses for app content integration
6. AI can read and suggest "Today's Message" and "Intention for today"

## Technical Details

**Total Cards:** 70 cards (numbered 0-69)
**Image Files:** JPG format, various sizes
**PDF Source:** Karten_Final.pdf (32 pages, table format)

**Card Naming Pattern:**
- `[number]_[name]_[optional_category].jpg`
- Examples: `0_let_the_light_in.jpg`, `47_priority_DISCIPLINE_CAUSAL_ANALYSIS.jpg`

## Next Steps

1. ✅ Extract all text from PDF
2. ✅ Match each card text with corresponding image
3. ✅ Create formatted document
4. ⏳ Generate Today's Message & Intention suggestions
5. ⏳ Deliver to client for review
