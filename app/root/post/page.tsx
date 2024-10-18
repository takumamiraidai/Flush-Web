"use client";
import React, { useEffect, useState, FormEvent } from 'react';
import auth from '../../firebaseConfig'; 
import { onAuthStateChanged, User } from "firebase/auth";
import FileUpload from '../../ui/fileUpload';
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  id: string;  //ユーザーID
  title: string;  //タイトル
  postDate: string;  //投稿日時
  deadDate: string;  //締め切り
  imageURL: string;  //画像URL
  ownerID: string;  //オーナーID
  num: number;  //募集人数
  count: number;  //参加人数
  reward: string;  //報酬
  type: string[];  //募集役職
  tag: string[];  //ハッシュタグ
  content: string[];  //内容リスト
  imageList: string[];  //画像リスト
  comment: string[];  //コメント
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '', 
    postDate: '',  // 投稿日時を後で設定
    deadDate: '', 
    imageURL: '', 
    ownerID: '', 
    num: 1, 
    count: 0,  // 初期値を0に設定
    reward: '', 
    type: [], 
    tag: [], 
    content: [], 
    imageList: [], 
    comment: [],
  });

  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
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

    const taskId = uuidv4();
    const currentDate = new Date().toISOString();  // 投稿日時として現在の日時を取得

    const updatedFormData = {
      ...formData,
      id: taskId,
      postDate: currentDate,  // 投稿日時に現在の日付をセット
      count: 0,  // 参加人数を0にセット
    };

    try {
      const response = await fetch('https://cloudfun-api.numb20crown-1102.workers.dev/api/post_task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),  // 修正後のformDataを使用
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        setMessage("Error: " + errorText);
        return;
      }

      const data = await response.json();
      setMessage(data.message || "Task updated successfully!");
    } catch (error) {
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
      
      <div>
        <p><strong>タイトル:</strong> {formData.title}</p>
        <p><strong>投稿日時:</strong> {formData.postDate}</p>
        <p><strong>締め切り:</strong> {formData.deadDate}（締め切り日）</p>
        <p><strong>募集人数:</strong> {formData.num}</p>
        <p><strong>参加人数:</strong> {formData.count}</p>
        <p><strong>募集職種:</strong> {formData.type.join(', ')}</p>
        <p><strong>ハッシュタグ:</strong> {formData.tag.join(', ')}</p>
        <p><strong>報酬:</strong> {formData.reward}</p>
        <p><strong>内容:</strong> {formData.content.join(', ')}</p>
        
        {/* 画像リストを表示 */}
        {formData.imageList.length > 0 && (
          <div>
            <strong>画像リスト:</strong>
            <ul>
              {formData.imageList.map((image, index) => (
                <li key={index}>{image}</li>
              ))}
            </ul>
          </div>
        )}
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
          
          <p>募集人数</p>
          <input
            id="num"
            type="number"
            name="num"
            placeholder="募集人数"
            value={formData.num}
            onChange={handleChange}
            required
            min={0}
            className="input-style"
          />

          <p>報酬</p>
          <input
            id="reward"
            type="text"
            name="reward"
            placeholder="報酬"
            value={formData.reward}
            onChange={handleChange}
            required
            className='input-style'
          />

          <p>締め切り</p>
          <input
            id="deadDate"
            type="date"
            name="deadDate"
            placeholder="締め切り"
            value={formData.deadDate}
            onChange={handleChange}
            required
            className='input-style'
          />

          <p>募集職種</p>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            multiple
            className='input-style'
          >
            <option value="デザイナー">デザイナー</option>
            <option value="3Dモデラー">3Dモデラー</option>
            <option value="モバイルアプリエンジニア">モバイルアプリエンジニア</option>
            <option value="フロントエンドエンジニア">フロントエンドエンジニア</option>
            <option value="バックエンドエンジニア">バックエンドエンジニア</option>
          </select>

          <p>ハッシュタグ</p>
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

          <p>内容</p>
          <textarea
            id="content"
            name="content"
            placeholder="内容"
            value={formData.content.join(', ')}
            onChange={(e) => setFormData((prevData) => ({
              ...prevData,
              content: e.target.value.split('\n').map(line => line.trim()),
            }))}
            required
            className="textarea-style"
          />

          <button type="submit" className="button-style">Submit</button>
        </div>
      </form>

      <p>{message}</p>
    </div>
  );
}
