# NUMERA — Reading Studio

A purple and black numerology reading studio with automatic DDMMYYYY birth-date calculations, the original triangular number grid, color-coded element relationships, and one-page PDF reports.

## Run

This is a static website. Serve this directory with any HTTP server, for example `python -m http.server 58931 --bind 127.0.0.1`.

For GitHub Pages, select the main branch and repository root in the repository’s Pages settings. All asset URLs are relative and work under /Numera/.

## Save readings

Save PDF creates the report and stores its actual bytes and reading details in the browser’s IndexedDB. Saved readings can reopen a reading or download its PDF. File names use `Name - DD-MMM-YYYY - Numera.pdf`.

The PDF is one A4 page: identity, generation timestamp, aligned grid, compact summary values, and color-coded element relationships. It excludes the profile table, reflection page, and separate five-element counts. Notes are retained in the device reading.

## Simpler Google Drive saving

Deploy google-drive/Code.gs privately in the Google account that owns the reports folder. Paste the resulting single /exec URL into Numera. No API keys, OAuth client IDs, or folder picker are needed. See GOOGLE-SETUP.md.

A Google window handles uploads. After it confirms the saved PDF, choose Back to Numera to update the archive. Device copies remain available if Google is not configured, a window is blocked, or an upload is unconfirmed. Google web-app deployment and live uploads require authorization in the owner’s account and are not yet verified.

## Calculation method and dependencies

core.js preserves the original Numera formula definitions, including the single digit-sum pass. pdfmake 0.2.12 and Roboto are bundled under vendor with their licenses. Google Fonts provides optional website typography.

This website stores personal data in its browser storage, not in the GitHub repository. Never commit exported client PDFs, private keys, or browser storage.
