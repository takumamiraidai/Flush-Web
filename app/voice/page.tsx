"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

interface SpeakerStyle {
  name: string;
  id: number;
  type: string;
}

interface Speaker {
  name: string;
  speaker_uuid: string;
  styles: SpeakerStyle[];
}

const Home: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await axios.get<Speaker[]>(`${process.env.NEXT_PUBLIC_VOICE_API_BASE_URL}speakers`, {
          headers: {
            "ngrok-skip-browser-warning": true,  // ngrokの警告を回避
          }
        });
        setSpeakers(response.data);
        console.log("Fetched speakers:", response.data);
        if (response.data.length > 0) {
          setSelectedSpeaker(response.data[0].speaker_uuid); 
          setSelectedStyle(response.data[0].styles[0]?.id || 0);
        }
      } catch (error) {
        console.error("Failed to fetch speakers:", error);
        alert("スピーカー一覧の取得に失敗しました");
      }
    };
    fetchSpeakers();
  }, []);

  const handleSynthesis = async () => {
    const text = textRef.current?.value;
    if (!text) {
      alert("テキストを入力してください");
      return;
    }

    console.log("Synthesizing audio with speaker:", selectedSpeaker);

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const queryResponse = await axios.post(
        process.env.NEXT_PUBLIC_VOICE_API_BASE_URL + "audio_query",
        null,
        {
          params: {
            text: text,
            speaker: selectedStyle,
          },
          headers: {
            "ngrok-skip-browser-warning": true,  // ngrokの警告を回避
          }
        }
      );

      const synthesisResponse = await axios.post(
        process.env.NEXT_PUBLIC_VOICE_API_BASE_URL + "synthesis",
        queryResponse.data,
        {
          params: {
            speaker: selectedStyle,
            enable_interrogative_upspeak: true,
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "audio/wav",
            "ngrok-skip-browser-warning": true,  // ngrokの警告を回避
          },
          responseType: "arraybuffer",
        }
      );

      const audioBlob = new Blob([synthesisResponse.data], { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      console.error("Error during synthesis:", error);
      alert("音声合成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>音声合成</h2>
      <input
        type="text"
        ref={textRef}
        placeholder="テキストを入力してください"
        style={{ width: "300px", marginRight: "10px" }}
      />
      <select
        value={selectedSpeaker}
        onChange={(e) => {
          const speakerUuid = e.target.value;
          setSelectedSpeaker(speakerUuid);
          // スピーカー変更時、最初のスタイルを選択
          const speaker = speakers.find((s) => s.speaker_uuid === speakerUuid);
          if (speaker) {
            setSelectedStyle(speaker.styles[0]?.id || null);
          }
        }}
        style={{ marginRight: "10px" }}
      >
        {speakers.map((speaker) => (
          <option key={speaker.speaker_uuid} value={speaker.speaker_uuid}>
            {speaker.name}
          </option>
        ))}
      </select>

      {selectedSpeaker && (
        <select
          value={selectedStyle || ""}
          onChange={(e) => setSelectedStyle(Number(e.target.value))}
          style={{ marginRight: "10px" }}
        >
          {speakers
            .find((speaker) => speaker.speaker_uuid === selectedSpeaker)
            ?.styles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
        </select>
      )}

      <button
        onClick={handleSynthesis}
        disabled={isLoading || speakers.length === 0 || selectedSpeaker === ""}
      >
        {isLoading ? "生成中..." : "音声を生成"}
      </button>

      {audioUrl && (
        <div style={{ marginTop: "20px" }}>
          <audio controls src={audioUrl} autoPlay>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default Home;
