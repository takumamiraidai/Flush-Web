"use client";

import { useState, useEffect } from 'react';
import './ui/VideoCreationForm.css';

const VideoCreationForm: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [motherSound, setMothersSound] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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

      const videoResponse = await fetch(
        "https://rage-tell-leather-walker.trycloudflare.com/merge_videos/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input_str: chatData.motherSound }),
        }
      );

      if (!videoResponse.ok) {
        const videoError = await videoResponse.json();
        throw new Error(videoError.detail || "Failed to merge videos");
      }

      const videoBlob = await videoResponse.blob();
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoFile(videoUrl);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const playVideoOnce = () => {
    if (!videoFile) {
      setError('No video file to play');
      return;
    }
  
    const videoElement = document.getElementById('mergedVideo') as HTMLVideoElement;
    videoElement.play().catch((err) => {
      setError('Failed to play the video: ' + err.message);
    });
  };
  
  useEffect(() => {
    if (videoFile) {
      playVideoOnce();
    }
  }, [videoFile]); // Trigger only when `videoFile` changes
  

  return (
    <div className="form-container">

      {error && <p className="error-message">{error}</p>}

      {(videoFile === null) ? (
        <div className="video-container">
          <div className="video-frame">
            <video
              id="mergedVideo"
              controls
              muted
              autoPlay
              className="styled-video"
              src= {process.env.VIDEO_BASE_URL + 'nn.mp4'}
            />
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
            <video id="mergedVideo" controls muted src={videoFile} className="styled-video"></video>
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
    </div>
  );
};

export default VideoCreationForm;
