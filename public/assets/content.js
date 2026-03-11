chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === "RUN_ANALYZE") {
    console.log("Analyze button pressed! Running content script...");
    
   const text = getPageText();

   try{
    const response = await fetch("https://tcextension-production.up.railway.app/api/analyze",{
      method: "POST",
      headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Server analysis result:", result);

    chrome.runtime.sendMessage({ action: "ANALYSIS_RESULT", data: result });
   } catch (error) {
      console.error("Error contacting server:", error);

      chrome.runtime.sendMessage({ 
          action: "ANALYSIS_ERROR", 
          error: error.message || "Failed to connect to the server." 
      });
    }
  }
});



function getPageText(){
    let targetElement = document.querySelector('main') || document.querySelector('article') || document.body;
    const clone = targetElement.cloneNode(true);
    const badTags = ['script', 'style', 'nav', 'footer', 'noscript', 'iframe'];

    badTags.forEach(tag => {
        const elements = clone.getElementsByTagName(tag);
        Array.from(elements).forEach(el => el.remove());
    });

    let textContent = clone.innerText.trim();

    const MAX_CHARS = 120000;
    if (textContent.length > MAX_CHARS) {
      textContent = textContent.substring(0, MAX_CHARS);
      console.warn("Text truncated to fit API limits.");
    }

    // console.log(textContent)
    return textContent;
}
