const MAX_RESULTS = 100;

function buildUI(holder, infoText, onInput) {
  const info = document.createElement('p');
  info.innerText = infoText;
  holder.appendChild(info);

  const search = document.createElement('input');
  search.setAttribute('type', 'search');
  search.setAttribute('placeholder', 'Type to Search');
  holder.appendChild(search);

  const output = document.createElement('ul');
  holder.appendChild(output);

  function addOutput(value) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(value));
    output.appendChild(li);
  }

  search.addEventListener('input', () => {
    const tm0 = Date.now();
    const items = onInput(search.value);
    const tm1 = Date.now();
    output.innerText = '';
    const displayCount = Math.min(MAX_RESULTS, items.length);
    for (let n = 0; n < displayCount; ++n) {
      addOutput(items[n]);
    }
    if (displayCount < items.length) {
      addOutput(`+ ${items.length - displayCount} more`);
    }
    info.innerText = infoText + ` Found ${items.length} occurrence(s) in ${tm1 - tm0}ms. Rendered ${displayCount} results in ${Date.now() - tm1}ms.`;
  });
}

(async () => {
  const doc = await fetch('war-and-peace.txt').then((d) => d.text());

  function runSearch(query) {
    if (!query) {
      return [];
    }
    const results = [];
    for (let i = -query.length; (i = doc.indexOf(query, i + query.length)) !== -1;) {
      results.push(`Found at index ${i}`);
    }
    return results;
  }

  document.body.innerText = '';
  buildUI(document.body, `Ready to search ${(doc.length / 1024 / 1024).toFixed(2)}MB document.`, runSearch);
})();
