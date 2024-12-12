"use client";
import React, { useState, FormEvent } from 'react';
import FileUpload from '../ui/fileUpload';

interface FormData {
  title: string;
  image: string;
  content: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    image: '',
    content: '',
  });

  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = (fileName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      image: `https://assets.takulog1.com/pics/blogpic/${fileName}`,
    }));
  };

  const handleInsertText = (text: string) => {
    setFormData((prevData) => ({
      ...prevData,
      content: prevData.content + text,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch('https://taku-log-api.tq5tmhpyr9.workers.dev/api/post_log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div className="w-full overflow-x-hidden flex flex-col p-8 pl-4 sm:pl-24">
      <h3 className="py-4 pb-10 text-gray-400">キャラセット</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-8">
          <input
            id="title"
            type="text"
            name="title"
            placeholder="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-style"
          />
          <input
            id="image"
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            required
            className="input-style"
            disabled
          />
          <FileUpload folderName="blogpic" onFileUpload={handleFileUpload}/>
          <textarea
            id="content"
            name="content"
            placeholder="main"
            value={formData.content}
            onChange={handleChange}
            required
            className="input-style h-80"
          />
          <button type="submit" className="button-style">Post</button>
        </div>
      </form>
      {message && <p className="py-8">{message}</p>}
    </div>
  );
}