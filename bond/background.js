chrome.action.onClicked.addListener(() => {
  const width = 600;
  const height = 800;

  chrome.windows.create({
    url: "popup.html",
    type: "normal",
    width,
    height,
    left: 100,
    top: 100
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "injectScript" && msg.file) {
    const tabId = msg.tabId || (sender.tab && sender.tab.id);
    if (!tabId) {
      sendResponse({ success: false, error: "No target tabId" });
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: [msg.file]
      },
      () => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ success: true });
        }
      }
    );
    return true;
  }
});