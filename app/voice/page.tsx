'use client';

import React, { useRef, useState, useEffect } from 'react';

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
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch('/api/speakers');
        if (!response.ok) {
          throw new Error('Failed to fetch speakers');
        }
        const data = await response.json();
        setSpeakers(data);
        if (data.length > 0) {
          setSelectedSpeaker(data[0].speaker_uuid);
          setSelectedStyle(data[0].styles[0]?.id || 0);
        }
      } catch (error) {
        console.error('Error fetching speakers:', error);
        alert('スピーカー一覧の取得に失敗しました');
      }
    };
    fetchSpeakers();
  }, []);

  const handleSynthesis = async () => {
    const text = textRef.current?.value;
    if (!text) {
      alert('テキストを入力してください');
      return;
    }

    setIsLoading(true);
    setAudioUrl(null);

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          speaker: selectedSpeaker,
          style: selectedStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('音声合成に失敗しました');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Error during synthesis:', error);
      alert((error as any).message || '音声合成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>音声合成</h2>
      <input
        type="text"
        ref={textRef}
        placeholder="テキストを入力してください"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <select
        value={selectedSpeaker}
        onChange={(e) => {
          const speakerUuid = e.target.value;
          setSelectedSpeaker(speakerUuid);
          const speaker = speakers.find((s) => s.speaker_uuid === speakerUuid);
          if (speaker) {
            setSelectedStyle(speaker.styles[0]?.id || null);
          }
        }}
        style={{ marginRight: '10px' }}
      >
        {speakers.map((speaker) => (
          <option key={speaker.speaker_uuid} value={speaker.speaker_uuid}>
            {speaker.name}
          </option>
        ))}
      </select>

      {selectedSpeaker && (
        <select
          value={selectedStyle || ''}
          onChange={(e) => setSelectedStyle(Number(e.target.value))}
          style={{ marginRight: '10px' }}
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
        disabled={isLoading || speakers.length === 0 || selectedSpeaker === ''}
      >
        {isLoading ? '生成中...' : '音声を生成'}
      </button>

      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <audio controls src={audioUrl} autoPlay>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default Home;
