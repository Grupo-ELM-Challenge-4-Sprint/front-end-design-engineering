import { useEffect } from 'react';

declare global {
  interface Window {
    watsonAssistantChatOptions: {
      integrationID: string;
      region: string;
      serviceInstanceID: string;
      clientVersion?: string;
      onLoad: (instance: { render: () => Promise<void> }) => Promise<void>;
    };
  }
}

export default function WatsonChat() {
  useEffect(() => {
    // Verificar se o script já foi carregado para evitar duplicatas
    if (document.querySelector('script[src*="WatsonAssistantChatEntry.js"]')) return;

    // Configurar o Watson Assistant
    window.watsonAssistantChatOptions = {
      integrationID: "41b39803-622b-419c-a690-8144ae42d17d",
      region: "us-south",
      serviceInstanceID: "ba04109b-07dd-469b-bf3a-53a3a71ae680",
      onLoad: async (instance: { render: () => Promise<void> }) => {
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
      const existingScript = document.querySelector('script[src*="WatsonAssistantChatEntry.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return null; // O Watson Assistant renderiza seu próprio botão
}
