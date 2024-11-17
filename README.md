# Pin ChatGPT Prompts

A Chrome extension that allows users to pin ChatGPT conversation URLs and titles for quick access.

## Features
- Save ChatGPT conversation URLs with their titles.
- Manage a list of pinned prompts.
- Fully local data storage.

## How to Use
1. Open a ChatGPT conversation.
2. Copy the conversation URL.
3. Paste the URL into the input field in the extension popup.
4. Click "Save" to pin the prompt.

## Installation (Developer Mode)
1. Clone this repository or download the ZIP file.
2. Go to `chrome://extensions` in your browser.
3. Enable "Developer mode" (toggle in the top-right corner).
4. Click "Load unpacked" and select the folder containing this extension.

## Permissions
- `activeTab`: To access the current active tab for fetching the ChatGPT conversation title.
- `host_permissions`: For `https://chat.openai.com/c/*` and `https://chatgpt.com/c/*` to retrieve conversation titles.
- `storage`: To save pinned prompts locally.

## Assets
Designed by me using Photoshop. Feel free to download and use

## License
MIT
