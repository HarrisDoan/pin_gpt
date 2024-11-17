document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save-prompt");
    const urlInput = document.getElementById("prompt-url");
    const promptList = document.getElementById("prompt-list");
  
    console.log("Popup loaded.");
  
    // Load saved prompts
    chrome.storage.sync.get("pinnedPrompts", (data) => {
      const pinnedPrompts = data.pinnedPrompts || [];
      console.log("Loading pinned prompts:", pinnedPrompts);
  
      pinnedPrompts.forEach(({ url, name }) => addPromptToList(url, name));
    });
  
    // Save button click
    saveButton.addEventListener("click", async () => {
      const url = urlInput.value.trim();
      if (url && isValidChatGPTUrl(url)) {
        const conversationName = await fetchConversationName(url);
        if (!conversationName) {
          alert("Could not retrieve the conversation name. Please check the URL.");
          return;
        }
  
        chrome.storage.sync.get("pinnedPrompts", (data) => {
          const pinnedPrompts = data.pinnedPrompts || [];
          console.log("Current prompts before saving:", pinnedPrompts);
  
          if (!pinnedPrompts.some((prompt) => prompt.url === url)) {
            pinnedPrompts.push({ url, name: conversationName });
            chrome.storage.sync.set({ pinnedPrompts }, () => {
              console.log("New prompt saved:", { url, name: conversationName });
              addPromptToList(url, conversationName);
              urlInput.value = ""; // Clear input
            });
          } else {
            alert("This URL is already pinned.");
          }
        });
      } else {
        alert("Please enter a valid ChatGPT conversation URL.");
      }
    });
  
    // Add a prompt to the list
    function addPromptToList(url, name) {
      const listItem = document.createElement("li");
  
      // Add link
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.textContent = name || url;
  
      // Add remove button
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.className = "remove-btn";
  
      removeButton.addEventListener("click", () => {
        chrome.storage.sync.get("pinnedPrompts", (data) => {
          const pinnedPrompts = data.pinnedPrompts || [];
          console.log("Before removal:", pinnedPrompts);
  
          const updatedPrompts = pinnedPrompts.filter((prompt) => prompt.url !== url);
          chrome.storage.sync.set({ pinnedPrompts: updatedPrompts }, () => {
            console.log("Removed prompt:", url);
            listItem.remove();
          });
        });
      });
  
      listItem.appendChild(link);
      listItem.appendChild(removeButton);
      promptList.appendChild(listItem);
    }
  
    // Check valid URL
    function isValidChatGPTUrl(url) {
      const validDomains = ["https://chat.openai.com/c/", "https://chatgpt.com/c/"];
      return validDomains.some((domain) => url.startsWith(domain));
    }
  
    // Fetch conversation name
    async function fetchConversationName(url) {
      return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab) {
            chrome.scripting.executeScript(
              {
                target: { tabId: activeTab.id },
                func: () => document.title.trim()
              },
              (results) => {
                if (chrome.runtime.lastError) {
                  console.error("Script error:", chrome.runtime.lastError.message);
                  resolve(null);
                } else {
                  resolve(results[0]?.result);
                }
              }
            );
          } else {
            resolve(null);
          }
        });
      });
    }
  });
  




// Minimum Working Code

// manifest.json

// {
//     "manifest_version": 3,
//     "name": "Pin ChatGPT Prompts",
//     "version": "1.0",
//     "description": "Pin and save ChatGPT prompts as URLs for quick access.",
//     "permissions": ["storage"],
//     "action": {
//       "default_popup": "popup.html"
//     }
//   }


// popup.html

// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Pin ChatGPT Prompts</title>
// </head>
// <body>
//   <h1>Pin ChatGPT Prompts</h1>
//   <input type="text" id="prompt-url" placeholder="Paste ChatGPT URL here">
//   <button id="save-prompt">Save</button>
//   <ul id="prompt-list"></ul>
//   <script src="popup.js"></script>
// </body>
// </html>


// popup.js

// document.addEventListener("DOMContentLoaded", () => {
//     const saveButton = document.getElementById("save-prompt");
//     const urlInput = document.getElementById("prompt-url");
//     const promptList = document.getElementById("prompt-list");
  
//     // Load saved prompts on popup load
//     chrome.storage.sync.get("pinnedPrompts", (data) => {
//       if (data.pinnedPrompts) {
//         data.pinnedPrompts.forEach((prompt) => addPromptToList(prompt));
//       }
//     });
  
//     // Save button click handler
//     saveButton.addEventListener("click", () => {
//       const url = urlInput.value.trim();
//       if (url && isValidChatGPTUrl(url)) {
//         chrome.storage.sync.get("pinnedPrompts", (data) => {
//           const pinnedPrompts = data.pinnedPrompts || [];
//           if (!pinnedPrompts.includes(url)) {
//             pinnedPrompts.push(url);
//             chrome.storage.sync.set({ pinnedPrompts }, () => {
//               addPromptToList(url);
//               urlInput.value = ""; // Clear input field
//             });
//           } else {
//             alert("This URL is already pinned.");
//           }
//         });
//       } else {
//         alert("Please enter a valid ChatGPT conversation URL.");
//       }
//     });
  
//     // Add a prompt to the list in the popup
//     function addPromptToList(url) {
//       const listItem = document.createElement("li");
  
//       // Link to the URL
//       const link = document.createElement("a");
//       link.href = url;
//       link.target = "_blank";
//       link.textContent = url;
  
//       // Remove button
//       const removeButton = document.createElement("button");
//       removeButton.textContent = "Remove";
//       removeButton.style.marginLeft = "10px";
//       removeButton.addEventListener("click", () => {
//         chrome.storage.sync.get("pinnedPrompts", (data) => {
//           const pinnedPrompts = data.pinnedPrompts || [];
//           const updatedPrompts = pinnedPrompts.filter((prompt) => prompt !== url);
//           chrome.storage.sync.set({ pinnedPrompts: updatedPrompts }, () => {
//             listItem.remove();
//           });
//         });
//       });
  
//       listItem.appendChild(link);
//       listItem.appendChild(removeButton);
//       promptList.appendChild(listItem);
//     }
  
//     // Validate if the URL matches the ChatGPT conversation pattern
//     function isValidChatGPTUrl(url) {
//       const validDomains = ["https://chat.openai.com/c/", "https://chatgpt.com/c/"];
//       return validDomains.some((domain) => url.startsWith(domain));
//     }
//   });
  
  