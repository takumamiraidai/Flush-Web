"use client";
import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import auth from '../../firebaseConfig'; // Firebase設定をインポート
import { onAuthStateChanged, User } from "firebase/auth";
import FileUpload from '../../ui/fileUpload';

interface FormData {
  id: string;
  name: string;
  imageURL: string;
  mail: string; 
  sns: string;
  course: '情報デザイン' | '情報システム' | '知能システム' | '複雑系' | '無所属' | '教員' | 'その他';
  grade: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    imageURL: '',
    mail: '',
    sns: '',
    course: 'その他',
    grade: '',
  });

  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<User | null>(null); // ユーザーの状態を管理

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser); // ユーザーの状態を保存
        
        setFormData((prevData) => ({
          ...prevData,
          id: authUser.uid, // Set the user ID in formData
        }));
  
        try {
          console.log("MyID: ", authUser.uid);
          const response = await fetch(`https://cloudfun-api.numb20crown-1102.workers.dev/api/get_profile_by_id/?id=${authUser.uid}`);
          if (response.ok) {
            const profileData = await response.json();
            console.log("Profile Data:", profileData);
            if (profileData.length > 0) {
              setFormData({
                id: authUser.uid,
                name: profileData[0].name || '',
                imageURL: profileData[0].imageURL || '',
                mail: profileData[0].mail || authUser.email || '',
                sns: profileData[0].sns || '',
                course: profileData[0].course || 'その他',
                grade: profileData[0].grade || '',
              });
            } else {
              console.warn("プロファイルデータが見つかりません");
            }
          } else {
            console.error("プロファイルデータの読み込みに失敗しました:", await response.text());
          }
        } catch (error) {
          console.error("プロファイルデータの読み込み中にエラーが発生しました:", error);
        }
      } else {
        setUser(null);
      }
    });
  
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);
  

  const handleFileUpload = (fileName: string) => {
    if (!formData.id) {
      console.error('User ID is not set. Cannot upload file.');
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      imageURL: fileName, 
    }));
    console.log(`Uploaded file name: ${fileName}`);
  };
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://cloudfun-api.numb20crown-1102.workers.dev/api/write_profile', {
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
        setMessage(data.message || "Profile updated successfully!");
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
    return <p>ログインしてください</p>; // ユーザーが認証されていない場合のメッセージ
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className="flex flex-col p-8 space-y-6 max-w-3xl mx-auto"> {/* 幅を制限し、中央揃え */}
      <h3 className="py-4 text-gray-400">My Profile</h3>
      
      {/* ユーザー情報の表示 */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg flex items-center">
        <img 
          src={formData.imageURL ? "https://pub-3532cc3aaee14e1e87ea82691c7b0805.r2.dev/" + formData.imageURL : 'default-image-url.jpg'}
          alt="Profile"
          className="w-40 h-40 rounded-full mr-4" // スペースを調整
        />
        <div>
          <p><strong>Name:</strong> {formData.name || '取得できません'}</p>
          <p><strong>Email:</strong> {formData.mail || '取得できません'}</p>
          <p><strong>SNS:</strong> {formData.sns || '取得できません'}</p>
          <p><strong>Course:</strong> {formData.course}</p>
          <p><strong>Grade:</strong> {formData.grade || '取得できません'}</p>
        </div>
      </div>
  

      <h3 className="py-4 pt-10 text-gray-400">Set Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col space-y-4'> {/* スペースを調整 */}
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
          <FileUpload folderName="profile-pic" id={formData.id} onFileUpload={handleFileUpload} />
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