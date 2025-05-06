function extractMessages() {
    const chatData = [];
    const messageElements = document.querySelectorAll("div.copyable-text");
  
    messageElements.forEach((messageElement) => {
      try {
        const prePlainText = messageElement.getAttribute("data-pre-plain-text");
        if (!prePlainText) return;
  
        const selectable = messageElement.querySelector(".selectable-text");
        const messageText = selectable ? selectable.innerText : "";
        if (!messageText.trim()) return;
  
        const nameMatch = prePlainText.trim().match(/\] (.+?):/);
        let name = nameMatch ? nameMatch[1] : "Unknown";
  
        const isOutgoing = messageElement.closest("div.message-out");
        if (isOutgoing) name = "me";
  
        chatData.push({ name, message: messageText });
      } catch (e) {
        console.warn("Erreur lors du traitement d’un message :", e);
      }
    });
  
    // Garder les 10 derniers messages
    const limit = 10;
    chatData.splice(0, chatData.length - limit);
    return chatData;
  }
  
  async function getSuggestionsFromBackend() {
    const messages = extractMessages();
    if (!messages || messages.length === 0) {
      console.warn("Aucun message à envoyer.");
      return [];
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messages)
      });
  
      const data = await response.json();
      if (!data || !data.suggestions || !Array.isArray(data.suggestions)) {
        console.warn("Format de réponse invalide :", data);
        return [];
      }
  
      return data.suggestions.slice(0, 3);
    } catch (error) {
      console.error("Erreur backend :", error);
      return [];
    }
  }
  
  // Nouvelle fonction pour injecter le texte dans WhatsApp Web
  function setWhatsAppText(message) {
    const input = document.querySelector('[contenteditable="true"][data-tab="10"]');
    if (!input) {
      console.error("Champ d'entrée WhatsApp introuvable.");
      return;
    }
  
    input.focus();
  
    // Supprime le texte existant
    document.execCommand('selectAll', false, null);
    document.execCommand('delete', false, null);
  
    // Injecte le nouveau texte
    document.execCommand('insertText', false, message);
  }
  
  function injectSuggestions(suggestions = []) {
    const footer = document.querySelector("footer");
    if (!footer) return;
  
    let suggestionsDiv = footer.querySelector(".suggestions");
    if (!suggestionsDiv) {
      suggestionsDiv = document.createElement("div");
      suggestionsDiv.classList.add("suggestions");
      footer.prepend(suggestionsDiv);
    }
  
    suggestionsDiv.innerHTML = "";
  
    const reSuggestButton = document.createElement("div");
    reSuggestButton.classList.add("suggestion", "resuggest");
    reSuggestButton.textContent = "Get Suggestions...";
    suggestionsDiv.appendChild(reSuggestButton);
  
    reSuggestButton.addEventListener("click", async () => {
      reSuggestButton.textContent = "Loading...";
      reSuggestButton.classList.add("loading");
  
      const newSuggestions = await getSuggestionsFromBackend();
      injectSuggestions(newSuggestions);
    });
  
    suggestions.forEach((text) => {
      const suggestionDiv = document.createElement("div");
      suggestionDiv.classList.add("suggestion");
      suggestionDiv.textContent = text;
  
      suggestionDiv.addEventListener("click", () => {
        setWhatsAppText(text); // Injection directe dans l'input WhatsApp
  
        suggestionDiv.classList.add("copied");
        setTimeout(() => {
          suggestionDiv.classList.remove("copied");
        }, 1000);
      });
  
      suggestionsDiv.appendChild(suggestionDiv);
    });
  }
  
  function initSuggestionsUI() {
    const footer = document.querySelector("footer");
    if (footer && !footer.querySelector(".suggestions")) {
      injectSuggestions([]);
    }
  }
  
  // Observer le DOM pour ajouter les suggestions quand le footer apparaît
  const observer = new MutationObserver(() => {
    initSuggestionsUI();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  