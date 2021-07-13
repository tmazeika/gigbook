const currentScriptSrc = new URL(document.currentScript.src);
const rootUrl = `${currentScriptSrc.protocol}//${currentScriptSrc.host}`;

// load styles
const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = `${rootUrl}/preview.css`;
document.head.append(cssLink);

// load Mustache and render
const mustacheScript = document.createElement('script');
mustacheScript.addEventListener('load', async () => {
  if (typeof data === 'undefined') {
    const e = 'No template data found. Please define a global `data` variable.';
    showError(e);
    return;
  }
  try {
    const res = await fetch(window.location.href);
    let htmlSrc = await res.text();
    htmlSrc = htmlSrc.replace(/<head ?.*?>.*<\/head ?.*?>/is, '')
    document.body.innerHTML = Mustache.render(
      /<body ?.*?>(.*)<\/body ?.*?>/is.exec(htmlSrc)[1],
      data,
    );
  } catch (e) {
    showError(e);
  }
});
mustacheScript.src = `${rootUrl}/mustache.min.js`;
document.head.append(mustacheScript);

function showError(e) {
  console.error('GigBook:', e);
  document.body.style.all = 'initial';
  const preEl = document.createElement('pre');
  preEl.textContent = String(e);
  document.body.textContent = '';
  document.body.append(preEl);
}
