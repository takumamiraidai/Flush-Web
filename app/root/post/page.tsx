"use client";
import React, { useEffect, useState, FormEvent } from 'react';
import auth from '../../firebaseConfig'; 
import { onAuthStateChanged, User } from "firebase/auth";
import FileUpload from '../../ui/fileUpload';
import { v4 as uuidv4 } from 'uuid';  // Import UUID generator

interface FormData {
  id: string;  //ユーザーID
  title: string;  //タイトル
  imageURL: string;  //画像URL
  ownerID: string;  //オーナーID
  num: string;  //募集人数
  type: string[];  //募集役職
  tag: string[];  //募集業務
  content: string;  //内容
  comment: string[];  //コメント
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '', 
    imageURL: '', 
    ownerID: '', 
    num: '', 
    type: [], 
    tag: [], 
    content: '', 
    comment: [],
  });

  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Set the ownerID to the authenticated user's UID
        setFormData((prevData) => ({
          ...prevData,
          ownerID: user.uid,
        }));
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "type") {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData((prevData) => ({
        ...prevData,
        type: selectedOptions,
      }));
    } else if (name === "tag") {
      const tagsArray = value.split(',').map(tag => tag.trim());
      setFormData((prevData) => ({
        ...prevData,
        tag: tagsArray,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileUpload = (fileName: string) => {
    setFormData((prevData) => ({
      ...prevData,
      imageURL: fileName, 
    }));
    console.log(`Uploaded file name: ${fileName}`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Set the form's id to a generated UUID
    const taskId = uuidv4();
    setFormData((prevData) => ({
      ...prevData,
      id: taskId,
    }));

    const taskData = { ...formData, id: taskId }; // Ensure taskData has the updated id

    try {
      const response = await fetch('https://cloudfun-api.numb20crown-1102.workers.dev/api/post_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setMessage("Error: " + errorText);
        return;
      }
  
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setMessage(data.message || "Task updated successfully!");
      } else {
        setMessage("Unexpected response format");
        console.error("Response was not JSON:", await response.text());
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Error: " + (error as any).message);
    }
  };

  if (!user) {
    return <p>ログインしてください</p>; 
  }

  return (
    <div className="flex flex-col p-8 space-y-6 max-w-3xl mx-auto">
      <h3 className="py-4 text-gray-400">Task</h3>
      
      <img 
          src={formData.imageURL ? "https://pub-3532cc3aaee14e1e87ea82691c7b0805.r2.dev/" + formData.imageURL : 'default-image-url.jpg'}
          alt="Profile"
          className="w-40 h-40 mr-4"
        />
      <div className="mb-8 p-4 bg-gray-100 rounded-lg flex items-center">
        <div>
          <p><strong>タイトル:</strong> {formData.title}</p>
          <p><strong>募集人数:</strong> {formData.num}</p>
          <p><strong>募集職種:</strong> {formData.type}</p>
          <p><strong>ハッシュタグ:</strong> {formData.tag}</p>
          <p><strong>内容:</strong> {formData.content}</p>
        </div>
      </div>
  
      <h3 className="py-4 pt-10 text-gray-400">Post Task</h3>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col space-y-4'>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="タイトル"
            value={formData.title}
            onChange={handleChange}
            required
            className='input-style'
          />

          <FileUpload folderName="task-pic" id={uuidv4()} onFileUpload={handleFileUpload} />
          
          <input
            id="num"
            type="text"
            name="num"
            placeholder="募集人数"
            value={formData.num}
            onChange={handleChange}
            required
            className='input-style'
          />

          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            multiple
            className='input-style'
          >
            <option value="募集職種">募集職種</option>
            <option value="デザイナー">デザイナー</option>
            <option value="3Dモデラー">3Dモデラー</option>
            <option value="モバイルアプリエンジニア">モバイルアプリエンジニア</option>
            <option value="フロントエンドエンジニア">フロントエンドエンジニア</option>
            <option value="バックエンドエンジニア">バックエンドエンジニア</option>
            <option value="機械学習エンジニア">機械学習エンジニア</option>
            <option value="バイト">バイト</option>
            <option value="サークル">サークル</option>
            <option value="研究">研究</option>
            <option value="その他">その他</option>
          </select>

          <input
            id="tag"
            type="text"
            name="tag"
            placeholder="ハッシュタグ (カンマで区切る)"
            value={formData.tag.join(', ')}
            onChange={handleChange}
            required
            className='input-style'
          />

          <input
            id="content"
            type="text"
            name="content"
            placeholder="内容"
            value={formData.content}
            onChange={handleChange}
            required
            className='input-style'
          />
          <button type="submit" className='button-style'>Post</button>
        </div>
      </form>
      {message && <p className="py-8">{message}</p>}
    </div>
  );
}
