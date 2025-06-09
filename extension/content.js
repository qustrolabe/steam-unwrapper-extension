const classSignature = '.landingTable > div > .recommendation'

function triggerDsOptions(item, tooltipIndex) {
  const store_capsule = item.querySelector('a.store_capsule');
  store_capsule.dispatchEvent(new Event('mouseover'));

  const dsOptions = item.querySelector('.ds_options');
  if (dsOptions) {
    dsOptions.click();
    const tooltip = document.getElementsByClassName('ds_options_tooltip')[0];
    if (tooltip && tooltip.children[tooltipIndex]) {
      const btn = tooltip.children[tooltipIndex];
      const btnText = btn.textContent || '';
      if (/ignore|wishlist/i.test(btnText)) {
        btn.click();
      } else {
        console.error('Fail: Button text does not match Ignore or Wishlist');
      }
    }
  }

  store_capsule.dispatchEvent(new Event('mouseout', {bubbles: false}));
}

function injectButton(item) {
  if (item.querySelector('.custom-action-button')) return;

  // Toggle Ignore Button
  const ignoreButton = document.createElement('button');
  ignoreButton.className = 'custom-action-button';
  ignoreButton.textContent = 'Toggle Ignore';
  ignoreButton.setAttribute('type', 'button');
  ignoreButton.addEventListener('click', (event) => {
    triggerDsOptions(item, 1);
  });

  // Toggle Wishlist Button
  const wishlistButton = document.createElement('button');
  wishlistButton.className = 'custom-action-button';
  wishlistButton.textContent = 'Toggle Wishlist';
  wishlistButton.setAttribute('type', 'button');
  wishlistButton.style.marginLeft = '6px';
  wishlistButton.addEventListener('click', (event) => {
    triggerDsOptions(item, 0);
  });

  item.appendChild(ignoreButton);
  item.appendChild(wishlistButton);
}

// Initial injection for already-loaded items
function processListItems() {
  const items = document.querySelectorAll(classSignature);
  items.forEach(item => injectButton(item));
}
processListItems();

// Injection on newly loaded items
const listContainer = document.querySelector('.landingTable');
if (listContainer) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            node.querySelectorAll(classSignature)
                .forEach(item => injectButton(item));
          }
        });
      }
    });
  });

  observer.observe(listContainer, {
    childList: true,
  });
}