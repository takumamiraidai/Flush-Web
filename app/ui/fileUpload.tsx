import React, { useState } from 'react';

interface FileUploadProps {
  folderName: string;
  id: string;
  onFileUpload: (fileName: string) => void;
}

export default function FileUpload({ folderName, id, onFileUpload }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); // Uploaded image URL

  const handleFiles = (selectedFiles: FileList | File[]) => {
    setFiles(Array.from(selectedFiles).slice(0, 1)); // Only accept one file
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
    if (files.length > 0) {
      const file = files[0];
      // Rename file with folder name and id
      const renamedFile = new File([file], `${folderName}/${id}.${file.name.split('.').pop()}`, {
        type: file.type,
      });
      formData.append('file', renamedFile);
    }

    try {
      const response = await fetch('https://cloudfun-api.numb20crown-1102.workers.dev/api/upload_pic', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          onFileUpload(`${folderName}/${id}.${files[0].name.split('.').pop()}`);
          setFiles([]); // Clear files after successful upload
          setUploadedImageUrl(data.url); // Set the direct image URL (not a signed URL)
        }
      } else {
        console.error('Upload failed:', await response.text());
      }
    } catch (error) {
      console.error('Error during file upload:', error);
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
            <button type="button" onClick={removeFile} className="ml-4 px-2 rounded-lg bg-gray-200">Cancel</button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={uploadFiles} disabled={files.length === 0} className="button-style">
        Upload File
      </button>

      {/* Display uploaded image if URL exists */}
      {uploadedImageUrl && (
        <div className="uploaded-image">
          <h3>Uploaded Image:</h3>
          <img src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
}
