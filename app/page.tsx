"use client";

import { useState, useEffect } from 'react';
import './VideoCreationForm.css'; // CSS ファイルを使用

const VideoCreationForm: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [vowelData, setVowelData] = useState<string | null>(null);
  const [videoFiles, setVideoFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: null,
          relation: 0,
          input: prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create video');
      }

      const data = await response.json();
      setAiResponse(data.aiResponse);
      setVowelData(data.vowelData);
      setVideoFiles(data.videoFiles || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const playVideosInSequence = () => {
    if (!videoFiles || videoFiles.length === 0) {
      setError('No video files to play');
      return;
    }

    const videoElement = document.getElementById('mergedVideo') as HTMLVideoElement;
    let currentIndex = 0;

    const playNextVideo = () => {
      if (currentIndex < videoFiles.length) {
        const videoSrc = videoFiles[currentIndex];
        const extension = videoSrc.split('.').pop()?.toLowerCase();

        if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') {
          videoElement.src = videoSrc;
          videoElement
            .play()
            .catch((err) => setError(`Failed to play video: ${videoSrc}. Error: ${err.message}`));
        } else {
          setError(`Unsupported video format: ${videoSrc}. Supported formats are mp4, webm, and ogg.`);
          return;
        }

        currentIndex++;
      }
    };

    videoElement.addEventListener('ended', playNextVideo);
    playNextVideo();
  };

  useEffect(() => {
    if (videoFiles.length > 0) {
      playVideosInSequence();
    }
  }, [videoFiles]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Video'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {(videoFiles.length === 0 || videoFiles === null) ? (
        <div className="video-container">
          <div className="video-frame">
            <video
              id="mergedVideo"
              controls
              muted
              autoPlay
              className="styled-video"
              src="https://pub-236f879296c34fa0ae3be6ed4dd37deb.r2.dev/videos/nn.mp4"
            />
            <textarea
              className="styled-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              rows={4}
            />
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
            <video id="mergedVideo" controls muted autoPlay className="styled-video"></video>
            <textarea
              className="styled-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              rows={4}
            />
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
