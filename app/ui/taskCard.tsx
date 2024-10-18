import Link from 'next/link';

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

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="shadow-2xl rounded-lg relative group">
        <Link href={`/root/list/${task.id}`} className="rounded-2xl">
          <img
              src={"https://pub-3532cc3aaee14e1e87ea82691c7b0805.r2.dev/" + task.imageURL}
              alt={task.title}
              className="rounded-t-lg aspect-[2/1.2]"
            />
          <div className="flex flex-col px-4 py-2">
              <span className="font-bold text-lg truncate overflow-hidden whitespace-nowrap text-ellipsis">
                {task.title}
              </span>
              <div className='flex pt-2'>
                {task.tag.map((t, index) => (
                  <span key={index} className="text-sm bg-gray-200 text-gray-500 py-[2px] px-[8px] m-[4px] rounded-2xl">
                    {t}
                  </span>
                ))}
              </div>  
              <span className="border-b mb-2 border-gray-300"></span>
              <div className='flex'>
                <span className="font-base text-sm truncate overflow-hidden whitespace-nowrap text-ellipsis py-2 px-2">
                  👤: {task.num}
                </span>
                <span className="font-base text-sm truncate overflow-hidden whitespace-nowrap text-ellipsis py-2 px-2">
                  🕐: {task.deadDate}
                </span>
              </div>
              <span className="font-base text-sm truncate overflow-hidden whitespace-nowrap text-ellipsis py-2">
                  💰: {task.reward}
              </span>
          </div>
          <div className="absolute inset-0 bg-blue-200 bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-white font-extrabold text-4xl">Check</span>
          </div>
        </Link>
    </div>
  );
};

export default TaskCard;
