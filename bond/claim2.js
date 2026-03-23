(function () {
  console.log("[claim2.js] started");
  let isToggleActive = true;
  window.__claim2_active = true;

  const DEFAULT_MAX = 1000.00;
  let minAmount = 0.50;
  let positionIndex = 1; // fallback (second last button)
  const maxAmount = DEFAULT_MAX;

  function loadSettings(cb) {
    chrome.storage.local.get(["claim2Amount", "claim2Position", "claim2Active"], (data) => {
      if (data.claim2Amount) {
        const parsed = parseFloat(String(data.claim2Amount).replace(/[^0-9.]/g, ""));
        minAmount = !isNaN(parsed) ? parsed : 0;
        console.log("[claim2.js] minAmount set to", minAmount);
      } else {
        minAmount = 0;
        console.log("[claim2.js] no claim2Amount found, using 0");
      }

      if (typeof data.claim2Position === "number") {
        positionIndex = data.claim2Position;
        console.log("[claim2.js] positionIndex set to", positionIndex);
      }

      if (typeof data.claim2Active === "boolean") {
        isToggleActive = data.claim2Active;
        window.__claim2_active = data.claim2Active;
      }

      if (typeof cb === "function") cb();
    });
  }

  loadSettings(() => {
    const observer = new MutationObserver(mutations => {
      if (!isToggleActive || !window.__claim2_active) return;

      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          try {
            if (node.nodeType !== 1) return;
            const buttons = node.tagName === 'BUTTON'
              ? [node]
              : (node.querySelectorAll ? node.querySelectorAll('button') : []);
            if (!buttons || buttons.length === 0) return;

            const claimButtons = Array.from(buttons).filter(btn =>
              (btn.innerText || "").toUpperCase().includes('CLAIM')
            );
            if (claimButtons.length === 0) return;

            // Pick target button by index (default fallback if out of range)
            let targetBtn = null;
            if (positionIndex >= 0 && positionIndex < claimButtons.length) {
              targetBtn = claimButtons[positionIndex];
            } else {
              targetBtn = claimButtons[claimButtons.length - 2] || claimButtons[0];
            }
            if (!targetBtn) return;
            if (targetBtn.dataset.__claimedByExtension === "1") return;

            const amountDiv = targetBtn.closest('div')?.querySelector('.amount span');
            if (!amountDiv) { console.log('[claim2.js] amount not found, skipping.'); return; }
            const text = (amountDiv.textContent || '').trim();
            const amount = parseFloat(text.replace(/[^\d.]/g, ''));
            if (isNaN(amount)) { console.log('[claim2.js] could not parse amount:', text); return; }

            if (amount >= minAmount && amount <= maxAmount) {
              try {
                targetBtn.click();
                targetBtn.dataset.__claimedByExtension = "1";
                console.log('[claim2.js] clicked', amount);
              } catch (e) {
                console.warn("[claim2.js] click failed", e);
              }
            } else {
              console.log('[claim2.js] skipped amount not in range', amount);
            }
          } catch (err) {
            console.warn("[claim2.js] observer error", err);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.__claim2_disconnect = () => observer.disconnect();
    window.__claim2_toggle = (val) => { isToggleActive = !!val; window.__claim2_active = !!val; };

    console.log("[claim2.js] observer started");
  });
})();