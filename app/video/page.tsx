'use client';
import { useState } from 'react';

const Home = () => {
  const [inputStr, setInputStr] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setVideoUrl(null);  // 動画が生成される前にURLをリセット

    try {

      const response = await fetch(process.env.NEXT_PUBLIC_VIDEO_API_BASE_URL + "merge_videos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_str: inputStr, // フォームから入力された文字列
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 動画ファイルが返ってきた場合、Blobとして処理する
      const videoBlob = await response.blob();
      
      // BlobをURLとして利用
      const videoUrl = URL.createObjectURL(videoBlob);

      setVideoUrl(videoUrl); // 動画URLをセット
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>テキストで動画を生成</h1>
      <input
        type="text"
        value={inputStr}
        onChange={(e) => setInputStr(e.target.value)}
        placeholder="テキストを入力"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '生成中...' : '動画生成'}
      </button>

      {videoUrl && (
        <div>
          <h2>生成された動画</h2>
          <video controls>
            <source src={videoUrl} type="video/mp4" />
            お使いのブラウザは video タグに対応していません。
          </video>
        </div>
      )}
    </div>
  );
};

export default Home;
