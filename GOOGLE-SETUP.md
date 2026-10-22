# Private Google saver — one link

1. Sign in to the Google account that owns the reports folder and open https://script.google.com/home/start.
2. Create a project, replace Code.gs with google-drive/Code.gs from this package, and choose Deploy → New deployment → Web app.
3. Set Execute as **Me** and Who has access to **Only myself**. Authorize Google and deploy.
4. Copy the /exec web-app URL. Paste it into Numera’s Google saver dialog. It opens Google once to confirm folder access.

After that, Save PDF stores the PDF on this device and opens Google to save it to the fixed folder. Choose **Back to Numera — confirm saved** on Google’s success page to update the device archive. If you need to sign in first, finish connecting, then retry the pending report from Saved readings.

There are no client IDs, API keys, or folder pickers. Do not deploy this saver with public access. It also checks that the signed-in account is the script owner. Your Google credentials never go into the website.

The configured folder is `1PXNm3h8UTRnIyrPjn5NRXpG7N-tbm8K3`. Only Google’s actual saved-file result followed by a matching one-time return reference marks the archive entry saved. Closing the Google window leaves the report pending, with the PDF available on the device. Repeated uploads of the same reading reuse the saved file.

Google’s private web-app authorization and upload still require testing in your account. The previous connected Drive account could not access this folder. Apps Script deployment must be performed by the folder owner.

The script permits localhost preview and `https://parallelstudio02.github.io`. Add a different published origin to NUMERA_ORIGINS if you use a custom domain. Google Drive copies and browser copies are separate; clearing site data removes device copies, and deleting a device copy keeps the Drive file.

[Google web-app documentation](https://developers.google.com/apps-script/guides/web) · [Google sandbox navigation](https://developers.google.com/apps-script/guides/html/restrictions)
