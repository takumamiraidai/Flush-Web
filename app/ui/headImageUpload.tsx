import React, { useState } from 'react';

interface FileUploadProps {
  folderName: string;
  onFileUpload: (fileName: string) => void;
}

export default function FileUpload({ folderName, onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile); // 最初のファイルのみを保持
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]); // 最初のファイルのみを追加
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFile(event.target.files[0]); // 最初のファイルのみを追加
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFiles = async () => {
    if (!file) return; // ファイルがない場合は処理しない

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderName', folderName);

    try {
      const response = await fetch('https://taku-log-api.tq5tmhpyr9.workers.dev/api/upload_pic', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);

        if (data.url) {
          const uploaded = {
            name: file.name,
            url: data.url,
          };

          onFileUpload(uploaded.name);
          setUploadedFiles((prev) => [...prev, uploaded]);
          setFile(null); // アップロード成功後にリセット
        } else {
          console.error('Unexpected response format:', data);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
      >
        <p>Drag & Drop your Head Picture</p>
        <input type="file" onChange={handleFileInput} /> {/* `multiple` 属性を削除 */}
      </div>
      {file && (
        <ul className="m-2">
          <li className="file-item">
            {file.name}
            <button type='button' onClick={removeFile} className="ml-4 px-2 rounded-lg bg-gray-200">Cancel</button>
          </li>
        </ul>
      )}
      <button type='button' onClick={uploadFiles} disabled={!file} className="button-style">
        Up File
      </button>
      <ul className="mt-4 flex">
        {uploadedFiles.map((file, index) => (
          <li key={index} className="flex">
            <span className="font-base px-2">{file.name}:</span> <p className='font-bold text-red-400'>完了</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
