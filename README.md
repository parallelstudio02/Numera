# NUMERA — Reading Studio

A purple and black numerology reading studio with automatic DDMMYYYY birth-date calculations, the original triangular number grid, color-coded element relationships, and one-page PDF reports.

## Run

This is a static website. Serve this directory with any HTTP server, for example `python -m http.server 58931 --bind 127.0.0.1`.

For GitHub Pages, select the main branch and repository root in the repository’s Pages settings. All asset URLs are relative and work under /Numera/.

## Save readings

Save PDF creates the report and stores its actual bytes and reading details in the browser’s IndexedDB. Saved readings can reopen a reading or download its PDF. File names use `Name - DD-MMM-YYYY - Numera.pdf`.

The PDF is one A4 page: identity, generation timestamp, aligned grid, compact summary values, and color-coded element relationships. It excludes the profile table, reflection page, and separate five-element counts. Notes are retained in the device reading.

## Local PDF saving

Save PDF downloads the one-page report and stores the PDF and reading in this browser. Saved readings can reopen the reading or download the same PDF later. No cloud upload or external account setup is used.

## Calculation method and dependencies

core.js preserves the original Numera formula definitions, including the single digit-sum pass. pdfmake 0.2.12 and Roboto are bundled under vendor with their licenses. Google Fonts provides optional website typography.

This website stores personal data in its browser storage, not in the GitHub repository. Never commit exported client PDFs, private keys, or browser storage.
