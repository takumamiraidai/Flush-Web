"use client";

import { useRef, useState, useEffect } from 'react';
import './ui/VideoCreationForm.css';

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

const videoSpeakers = ["kapibara", "shimada", "tutan", "monarisa", "monarisa-uuid", "woman", "cat"];

const VideoCreationForm: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [motherSound, setMothersSound] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string>('shimada');
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const videoElement = useRef<HTMLVideoElement | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // AI応答の取得
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relation: 0, input: prompt }),
      });
  
      if (!chatResponse.ok) {
        const errorData = await chatResponse.json();
        throw new Error(errorData.error || "Failed to fetch AI response");
      }
  
      const chatData = await chatResponse.json();
      setAiResponse(chatData.aiResponse);
  
      const prefix = chatData.dere === 1 ? 'dere/' : 'tun/';
  
      // 音声合成の処理
      await handleSynthesis(chatData.aiResponse);
  
      if (isVideoEnabled) {
        // ビデオ生成が有効な場合のみビデオを取得
        const requestBody = {
          input_str: chatData.motherSound,
          dir: prefix + selectedVideo,
        };
  
        const videoResponse = await fetch(
          process.env.NEXT_PUBLIC_VIDEO_API_BASE_URL + "merge_videos/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          }
        );
  
        if (!videoResponse.ok) {
          const videoError = await videoResponse.json();
          throw new Error(videoError.detail || "Failed to merge videos");
        }
  
        const videoBlob = await videoResponse.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoFile(videoUrl);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleSynthesis = async (responseText: string) => {
    if (!selectedSpeaker || selectedStyle === null) {
      alert('スピーカーまたはスタイルが選択されていません');
      return;
    }

    if (!responseText || responseText.trim() === '') {
      alert('音声合成に利用できるテキストが空です');
      return;
    }

    setLoading(true);
    setAudioUrl(null);

    try {
      const requestBody = {
        text: responseText, // AIの応答を音声合成に利用
        speaker: selectedSpeaker,
        style: selectedStyle,
      };

      console.log("送信するリクエスト:", requestBody);

      const response = await fetch("/api/voice", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("エラー詳細:", errorData);
        throw new Error(errorData?.message || '音声合成に失敗しました');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error: any) {
      console.error('Error during synthesis:', error);
      alert(error.message || '音声合成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const playContent = () => {
    if (isVideoEnabled && videoFile && videoElement.current && audioElement.current) {
      // ビデオが有効な場合、ビデオと音声を同期再生
      videoElement.current.onplay = () => {
        audioElement.current?.play().catch((err) => {
          console.error('Failed to play audio:', err);
        });
      };
  
      videoElement.current.onpause = () => {
        audioElement.current?.pause();
      };
  
      videoElement.current.ontimeupdate = () => {
        if (
          audioElement.current &&
          videoElement.current && Math.abs(videoElement.current.currentTime - audioElement.current.currentTime) > 0.3
        ) {
          audioElement.current.currentTime = videoElement.current.currentTime;
        }
      };
  
      videoElement.current.play().catch((err) => {
        setError('Failed to play the video: ' + err.message);
      });
    } else if (!isVideoEnabled && audioUrl && audioElement.current) {
      // ビデオが無効な場合、音声のみ再生
      audioElement.current.play().catch((err) => {
        setError('Failed to play audio: ' + err.message);
      });
    }
  };
  
  useEffect(() => {
    // 音声またはビデオの再生をトリガー
    playContent();
  }, [videoFile, audioUrl, isVideoEnabled]);
  

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

  return (
    <div className='pt-20'>
    <div className="form-container">
      <label>
        <input
          type="checkbox"
          checked={isVideoEnabled}
          onChange={() => setIsVideoEnabled(!isVideoEnabled)}
        />
        ビデオ生成を有効にする
      </label>

      <select
        value={selectedVideo}
        onChange={(e) => {
          setSelectedVideo(e.target.value);
        }}
        style={{ marginRight: '10px' }}
      >
        {videoSpeakers.map((speaker) => (
          <option key={speaker} value={speaker}>
            {speaker}
          </option>
        ))}
      </select>
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

      {error && <p className="error-message">{error}</p>}

      {(videoFile === null || !isVideoEnabled) ? (
        <div className="video-container">
          <div className="video-frame">
            {isVideoEnabled ? (
              <video
                id="mergedVideo"
                ref={videoElement}
                controls
                muted
                className="styled-video"
                src={process.env.VIDEO_BASE_URL + 'nn.mp4'}
              />
            ) : null}
            <div className="video-overlay"></div>
            <textarea
              className="styled-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="会話できるよ"
              rows={4}
            />
            <form onSubmit={handleSubmit} className="form">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? '考え中...' : '送信'}
              </button>
            </form>
            <div className="styled-output">
              <div className="speech-bubble">
                <p>べ、別にあんたのことなんか好きじゃないんだからね！</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="video-container">
          <div className="video-frame">
            <video id="mergedVideo" ref={videoElement} controls muted autoPlay src={videoFile} className="styled-video"></video>
            <div className="video-overlay"></div>
            <textarea
              className="styled-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="会話できるよ"
              rows={4}
            />
            <form onSubmit={handleSubmit} className="form">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? '考え中...' : '送信'}
              </button>
            </form>
                {aiResponse && (
                  <div className="styled-output">
                    <div className="speech-bubble">
                      <p>{aiResponse}</p>
                    </div>
                  </div>
                )}
          </div>
        </div>
      )}
      {audioUrl && (
        <audio id="audioElement" ref={audioElement} src={audioUrl}></audio>
      )}
    </div>
    </div>
  );
};

export default VideoCreationForm;
