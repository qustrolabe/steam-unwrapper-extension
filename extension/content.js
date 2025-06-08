const classSignature = '.landingTable > div > .recommendation'

function injectButton(item) {
  if (item.querySelector('.custom-ignore-button')) return;

  const button = document.createElement('button');
  button.className = 'custom-ignore-button';
  button.textContent = 'Toggle Ignore';
  button.setAttribute('type', 'button');
  button.addEventListener('click', (event) => {
    const store_capsule = item.querySelector('a.store_capsule');

    store_capsule.dispatchEvent(new Event('mouseover'));

    const dsOptions = item.querySelector('.ds_options');
    if (dsOptions) {
      dsOptions.click();

      const tooltip = document.getElementsByClassName('ds_options_tooltip')[0];
      if (tooltip && tooltip.children[1]) {
        const btn = tooltip.children[1];
        const btnText = btn.textContent.trim();
        if (btnText === 'Ignore' || btnText === 'Ignored') {
          btn.click();
        }
      }
    }

    store_capsule.dispatchEvent(new Event('mouseout', {bubbles: false}));
  });

  item.appendChild(button);
}

// Function to process all list items
function processListItems() {
  // Adjust selector to match your target list items
  const items = document.querySelectorAll(classSignature);
  items.forEach(item => injectButton(item));
}

// Initial injection for already-loaded items
processListItems();

// Injection on newly loaded items
const listContainer = document.querySelector('.landingTable');
if (listContainer) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          // Check if the added node is a div.recommendation or contains one
          if (node.nodeType === 1) {
            if (node.matches(classSignature)) {
              injectButton(node);
            }
            // Also check descendants for matching elements
            node.querySelectorAll(classSignature)
                .forEach(item => injectButton(item));
          }
        });
      }
    });
  });

  observer.observe(listContainer, {
    childList: true,  // Watch for added/removed nodes
    subtree: true     // Watch all descendants
  });
}