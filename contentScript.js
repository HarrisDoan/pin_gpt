// Extract the conversation name from the page
(() => {
    const titleElement = document.querySelector("title");
    if (titleElement) {
      chrome.runtime.sendMessage({ conversationName: titleElement.innerText.trim() });
    }
  })();
  