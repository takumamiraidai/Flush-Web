import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  imageURL: string;
  ownerID: string;
  num: string;
  type: string[];
  tag: string[];
  content: string;
  comment: string[];
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="shadow-2xl rounded-2xl relative group">
        <Link href={`/root/list/${task.id}`} className="rounded-2xl">
          <img
              src={"https://pub-3532cc3aaee14e1e87ea82691c7b0805.r2.dev/" + task.imageURL}
              alt={task.title}
              className="rounded-t-2xl aspect-[2/1.2]"
            />
          <div className="flex flex-col px-4 py-2">
            <span className="font-bold text-lg truncate overflow-hidden whitespace-nowrap text-ellipsis">{task.title}</span>
          </div>
          <div className="absolute inset-0 bg-blue-200 bg-opacity-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-white font-extrabold text-4xl">View</span>
          </div>
        </Link>
    </div>
  );
};

export default TaskCard;
