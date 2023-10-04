import { useState } from 'react';
import { SpeechConfig, AudioConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

export default function Home() {
    const [transcription, setTranscription] = useState<string | null>(null);

    const handleSpeechToText = async () => {
        const speechConfig = SpeechConfig.fromSubscription(process.env.NEXT_PUBLIC_SPEECH_KEY || "", process.env.NEXT_PUBLIC_SPEECH_REGION || "");
        speechConfig.speechRecognitionLanguage = "pt-BR";
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        
        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        
        recognizer.recognizeOnceAsync(result => {
            setTranscription(result.text);
            recognizer.close();

            
            saveToAPI(result.text);
        });
    };

    const saveToAPI = async (text: string) => {
        try {
            const payload = { text };
            console.log("Sending payload:", payload);
            const response = await fetch('/api/saveTranscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            
            const data = await response.json();

            if (!data.success) {
                console.error("Failed to save transcription.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div>
            <button onClick={handleSpeechToText}>Start Recording</button>
            <p>Transcription: {transcription}</p>
        </div>
    )
}
