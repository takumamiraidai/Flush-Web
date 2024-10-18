'use client';
import TaskCard from '@/app/ui/taskCard';
import React, { useEffect, useState } from 'react';

interface Task {
  id: string;  //ユーザーID
  title: string;  //タイトル
  postData: string;  //投稿日時
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

const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch('https://cloudfun-api.numb20crown-1102.workers.dev/api/get_all_task');  // APIのエンドポイントを指定
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// タスク一覧表示コンポーネント
const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // タスクデータを取得する
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
        console.log('Tasks:', fetchedTasks);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tasks');
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return <div className="w-full text-center py-10">Loading Tasks ...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-10">Error: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col p-14 px-[50px] lg:px-[150px] mx-auto">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[70px]"> 
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task, index) => (
            <div className="relative w-full shadow-xl rounded-lg" key={index}>
              <TaskCard task={task} />
            </div>
          ))
        )}
      </div>
    </div>

  );
};

export default TaskList;
