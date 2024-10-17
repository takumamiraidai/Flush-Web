"use client";
import React, { useEffect, useState, FormEvent } from 'react';
import auth from '../../firebaseConfig'; 
import { onAuthStateChanged, User } from "firebase/auth";
import FileUpload from '../../ui/fileUpload';

interface FormData {
  id: string;  //ユーザーID
  title: string;  //タイトル
  imageURL: string;  //画像URL
  ownerID: string;  //オーナーID
  num: string;  //募集人数
  type: string[];  //募集役職
  job: string[];  //募集業務
  content: string;  //内容
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '', 
    imageURL: '', 
    ownerID: '', 
    num: '', 
    type: [], 
    job: [], 
    content: '', 
  });

  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
      imageURL: fileName, 
    }));
    console.log(`Uploaded file name: ${fileName}`);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://cloudfun-api.numb20crown-1102.workers.dev/api/post_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
    <div className="flex flex-col p-8 space-y-6 max-w-3xl mx-auto"> {/* 幅を制限し、中央揃え */}
      <h3 className="py-4 text-gray-400">Task</h3>
      
      <img 
          src={formData.imageURL ? "https://pub-3532cc3aaee14e1e87ea82691c7b0805.r2.dev/" + formData.imageURL : 'default-image-url.jpg'}
          alt="Profile"
          className="w-40 h-40 mr-4" // スペースを調整
        />
      {/* タスク情報の表示 */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg flex items-center">
        <div>
          <p><strong>タイトル:</strong> {formData.name}</p>
          <p><strong>募集人数:</strong> {formData.mail}</p>
          <p><strong>職種:</strong> {formData.sns}</p>
          <p><strong>募集役職:</strong> {formData.course}</p>
          <p><strong>内容:</strong> {formData.grade}</p>
        </div>
      </div>
  

      <h3 className="py-4 pt-10 text-gray-400">Post Task</h3>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col space-y-4'>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="name"
            value={formData.name}
            onChange={handleChange}
            required
            className='input-style'
          />
          <FileUpload folderName="task-pic" id={formData.id} onFileUpload={handleFileUpload} />
          <input
            id="mail"
            type="text"
            name="mail"
            placeholder="mail"
            value={formData.mail}
            onChange={handleChange}
            required
            className='input-style'
          />
          <input
            id="sns"
            type="text"
            name="sns"
            placeholder="sns"
            value={formData.sns}
            onChange={handleChange}
            required
            className='input-style'
          />
          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className='input-style'
          >
            <option value="情報デザイン">情報デザイン</option>
            <option value="情報システム">情報システム</option>
            <option value="知能システム">知能システム</option>
            <option value="複雑系">複雑系</option>
            <option value="無所属">無所属</option>
            <option value="教員">教員</option>
            <option value="その他">その他</option>
          </select>
          <input
            id="grade"
            type="text"
            name="grade"
            placeholder="grade"
            value={formData.grade}
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
