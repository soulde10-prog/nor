chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "fillForm" && msg.data) {
    // your original generic fill logic (if still needed)
    sendResponse({ success: true });
    return true;
  }

  if (msg.action === "fillLottoStarFields" && msg.data) {
    const d = msg.data;

    const set = (sel, val) => {
      const el = document.querySelector(sel);
      if (el && val !== undefined) {
        el.focus();
        el.value = val;
        el.dispatchEvent(new Event('input',  {bubbles:true}));
        el.dispatchEvent(new Event('change', {bubbles:true}));
        el.blur();
      }
    };

    set('input[name="id_number"]', d.id_number);
    set('input[name="mobile"]',     d.mobile);
    set('input[name="email"]',      d.email);
    set('input[name="password"]',   d.password);

    sendResponse({ success: true });
    return true;
  }

  if (msg.action === "fillHollywoodbetsFields" && msg.data) {
    const d = msg.data;

    const set = (sel, val) => {
      const el = document.querySelector(sel);
      if (el && val) {
        el.focus();
        el.value = val;
        el.dispatchEvent(new Event('input',  {bubbles:true}));
        el.dispatchEvent(new Event('change', {bubbles:true}));
        el.blur();
      }
    };

    set('input[name="IdentityNumber"], #IdentityNumber', d.identityNumber);
    set('input[name="FirstName"], #FirstName',           d.firstName);
    set('input[name="LastName"], #LastName',             d.lastName);

    // Optional: select SA citizen radio
    const yes = document.querySelector('input[name="identityType"][value="identityNumber"]');
    if (yes) {
      yes.checked = true;
      yes.dispatchEvent(new Event('change', {bubbles:true}));
    }

    sendResponse({ success: true });
    return true;
  }

  sendResponse({ ok: true });
});