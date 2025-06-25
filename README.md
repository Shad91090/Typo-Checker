# X Typo Monitor - Chrome Extension Installation Guide

Follow these steps carefully to install and run this extension in your Google Chrome browser.

## Step 1: Assemble the Extension Files

1.  **Create a Project Folder:** On your computer (e.g., on your Desktop), create a new folder. Name it something memorable like `X-Typo-Extension`.
2.  **Create Code Files:** Inside that new folder, create the four code files: `manifest.json`, `background.js`, `popup.html`, and `popup.js`. Copy and paste the code I provided into the corresponding files.
3.  **Create an `images` Folder:** Inside the `X-Typo-Extension` folder, create another folder and name it `images`. You must add three icons to this folder: `icon16.png`, `icon48.png`, and `icon128.png`. You can create your own simple square images for this, or find some free-to-use icons online.

Your final folder structure must look like this:

X-Typo-Extension/├── manifest.json├── background.js├── popup.html├── popup.js└── images/├── icon16.png├── icon48.png└── icon128.png
## Step 2: Get Your X (Twitter) API Bearer Token

This extension **cannot work** without a key to access the X API.

1.  If you don't have one, you will need to apply for a **free** X Developer account at [https://developer.twitter.com/](https://developer.twitter.com/).
2.  Once you have an account, create a new Project and then create a new App within that project.
3.  In your App's dashboard on the developer portal, go to the **"Keys and tokens"** section.
4.  Generate or copy the **"Bearer Token"**. This is a very long string of letters and numbers.

## Step 3: Add Your API Key to the Extension

1.  Open the `background.js` file you created in a text editor.
2.  Find this line near the top of the file:
    ```javascript
    const BEARER_TOKEN = 'YOUR_X_API_BEARER_TOKEN';
    ```
3.  Replace `YOUR_X_API_BEARER_TOKEN` with the actual Bearer Token you just copied. Make sure your key remains inside the single quotes.
4.  Save the `background.js` file.

## Step 4: Install the Extension in Chrome

1.  Open your Google Chrome browser.
2.  In the address bar, type `chrome://extensions` and press Enter.
3.  On the Extensions page, find the **"Developer mode"** toggle switch, which is usually in the top-right corner, and turn it **on**.
4.  A new row of buttons will appear. Click the **"Load unpacked"** button.
5.  A file selection window will open. Navigate to and select the **entire `X-Typo-Extension` folder** you created in Step 1.
6.  Click the "Select Folder" button.

The "X Typo Monitor" extension will now appear in your list of installed extensions and is fully active. You can click its icon in the Chrome toolbar to see the popup. The extension will now automatically check for typos every 15 minutes and will send you a pop-up notification if it discovers a potential error.
