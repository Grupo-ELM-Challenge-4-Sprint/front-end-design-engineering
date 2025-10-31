import { useEffect } from 'react';

declare global {
  interface Window {
    watsonAssistantChatOptions: any;
  }
}

export default function WatsonChat() {
  useEffect(() => {
    // Configurar o Watson Assistant
    window.watsonAssistantChatOptions = {
      integrationID: "41b39803-622b-419c-a690-8144ae42d17d",
      region: "us-south",
      serviceInstanceID: "ba04109b-07dd-469b-bf3a-53a3a71ae680",
      onLoad: async (instance: any) => { 
        await instance.render(); 
      }
    };

    // Carregar o script do Watson Assistant
    const script = document.createElement('script');
    script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + 
                 (window.watsonAssistantChatOptions.clientVersion || 'latest') + 
                 "/WatsonAssistantChatEntry.js";
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null; // O Watson Assistant renderiza seu próprio botão
}
