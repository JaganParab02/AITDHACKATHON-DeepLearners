chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCookie") {
      chrome.cookies.get({ url: "https://www.linkedin.com", name: "li_at" }, (cookie) => {
        if (cookie) {
          sendResponse({ li_at: cookie.value });
        } else {
          sendResponse({ li_at: null });
        }
      });
      return true; // Keeps the message channel open for async response
    }
  });