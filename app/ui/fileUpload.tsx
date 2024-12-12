import React, { useState } from 'react';

interface FileUploadProps {
  folderName: string;
  onFileUpload: (fileName: string) => void;
}

export default function FileUpload({ folderName, onFileUpload }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  const handleFiles = (selectedFiles: FileList | File[]) => {
    // 一つのファイルに制限
    setFiles(Array.from(selectedFiles).slice(0, 1));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  const removeFile = () => {
    setFiles([]);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
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
          const uploaded = [{
            name: files[0].name,
            url: data.url,
          }];
      
          onFileUpload(uploaded[0].name);
          setUploadedFiles(uploaded);
          setFiles([]);
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
        <p>Drag & Drop your Picture</p>
        <input type="file" multiple={false} onChange={handleFileInput} />
      </div>
      <ul className="m-2">
        {files.map((file, index) => (
          <li key={index} className="file-item">
            {file.name}
            <button type='button' onClick={removeFile} className="ml-4 px-2 rounded-lg bg-gray-200">Cancel</button>
          </li>
        ))}
      </ul>
      <button type='button' onClick={uploadFiles} disabled={files.length === 0} className="button-style">
        Up File
      </button>
      <ul className="mt-4 flex">
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <p className='font-bold text-red-400'>完了:</p>
            <a href={"https://assets.takulog1.com"+ new URL(file.url).pathname} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600">
              {file.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
