/** NUMERA private saver: deploy as Me, access Only myself. */
const NUMERA_FOLDER_ID='1PXNm3h8UTRnIyrPjn5NRXpG7N-tbm8K3';
const NUMERA_ORIGINS=['http://127.0.0.1:58931','https://parallelstudio02.github.io'];
function htmlEscape(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function page(title,body){return HtmlService.createHtmlOutput('<!doctype html><html><head><base target="_top"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#0b0811;color:#f4ecfb;font:16px Arial;max-width:620px;margin:70px auto;padding:30px}h1{color:#cea7ff;font-size:30px}p{line-height:1.7;color:#b9a7cb}a{display:inline-block;background:#8250b4;color:white;text-decoration:none;padding:14px 20px;border-radius:7px;margin:12px 12px 0 0}.small{font-size:12px}</style></head><body><p>NUMERA / PRIVATE DRIVE SAVER</p><h1>'+htmlEscape(title)+'</h1>'+body+'</body></html>').setTitle('Numera — Drive save');}
function requireOwner(){var active=Session.getActiveUser().getEmail(),owner=Session.getEffectiveUser().getEmail();if(!active||active!==owner)throw Error('Sign in to the Google account that owns this private saver.');}
function doGet(){try{requireOwner();var folder=DriveApp.getFolderById(NUMERA_FOLDER_ID);return page('Your folder is ready.','<p>Reports will be saved to <strong>'+htmlEscape(folder.getName())+'</strong>. Return to Numera and choose Save PDF, or Save to Drive for a pending report.</p><p class="small">Keep access set to Only myself. No API key or public upload endpoint is needed.</p>');}catch(error){return page('Folder access needs attention.','<p>This Google account cannot open the Numera folder. Check the folder ID and sign in to its owner account.</p>');}}
function doPost(e){var lock=LockService.getUserLock();try{
 requireOwner();var p=JSON.parse(e.parameter.payload||'{}');
 if(!/^[a-f0-9-]{36}$/i.test(p.id||'')||!/^[a-f0-9-]{36}$/i.test(p.nonce||''))throw Error('Invalid reading reference.');
 var returnUrl=String(p.returnUrl||''),match=returnUrl.match(/^(https?:\/\/[^/]+)(\/[^?#]*)?$/);
 if(!match||NUMERA_ORIGINS.indexOf(match[1])===-1)throw Error('Website address not approved. Add its origin to NUMERA_ORIGINS in this script.');
 var filename=String(p.filename||'');
 if(filename.length>180||/[<>:"/\\|?*\x00-\x1f]/.test(filename)||!/ - \d{2}-[A-Z][a-z]{2}-\d{4} - Numera\.pdf$/.test(filename))throw Error('Invalid PDF filename.');
 var encoded=String(p.pdfBase64||'');if(!encoded||encoded.length>7000000||!/^[A-Za-z0-9+/=\r\n]+$/.test(encoded))throw Error('Invalid or oversized PDF.');
 var bytes=Utilities.base64Decode(encoded);if(bytes.length>5000000||bytes.length<5||Utilities.newBlob(bytes.slice(0,5)).getDataAsString()!=='%PDF-')throw Error('Unsupported PDF.');
 lock.waitLock(15000);var folder=DriveApp.getFolderById(NUMERA_FOLDER_ID),properties=PropertiesService.getUserProperties(),key='numera_'+p.id,existing=properties.getProperty(key),file;
 if(existing){try{file=DriveApp.getFileById(existing);if(file.isTrashed())file=null;}catch(ignore){file=null;}}
 if(!file){file=folder.createFile(Utilities.newBlob(bytes,'application/pdf',filename));properties.setProperty(key,file.getId());}
 var callback=returnUrl+'#numera-drive='+encodeURIComponent(p.id)+'&nonce='+encodeURIComponent(p.nonce)+'&file='+encodeURIComponent(file.getId());
 return page('Your PDF is saved.','<p>'+htmlEscape(filename)+'</p><a href="'+htmlEscape(callback)+'" target="_top">Back to Numera — confirm saved</a><a href="'+htmlEscape(file.getUrl())+'" target="_blank" rel="noopener">View PDF in Drive</a><p class="small">Choose Back to Numera to update the reading’s Drive status on your device.</p>');
 }catch(error){return page('Your PDF was not confirmed.','<p>'+htmlEscape(error.message||'Upload failed.')+'</p><p>Your device copy is kept. If Google asked you to sign in first, finish connecting the web app before retrying from Numera.</p>');}finally{if(lock.hasLock())lock.releaseLock();}}
