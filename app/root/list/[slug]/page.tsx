"use client";
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';

interface SingleTaskProps {
  params: {
    slug: string;
  };
}

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

const fetchTask = async (slug: string): Promise<Task | null> => {
  try {
    const response = await fetch(`https://cloudfun-api.numb20crown-1102.workers.dev/api/get_task_by_id/?id=${slug}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }

    // API returns a single object, not an array, so no need for data[0]
    const data = await response.json();
    return data;  // Return the task object directly
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
};

const SingleBlog: React.FC<SingleTaskProps> = ({ params }) => {
  const { slug } = params;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) {
      console.error('Invalid slug:', slug);
      return;
    }

    const loadTask = async () => {
      try {
        const fetchedTask = await fetchTask(slug);
        setTask(fetchedTask);
        setLoading(false);
      } catch (error) {
        console.error('An error occurred while fetching the task:', error);
        setLoading(false);
      }
    };

    loadTask();
  }, [slug]);

  if (loading) {
    return <div className="w-full text-center py-10">Loading Task ...</div>;
  }

  if (!task) {
    return <div className="w-full text-center py-10">Task not found</div>;
  }

  return (
    <div className="flex flex-col px-8 sm:px-[60px] lg:px-[100px] ml-auto mr-auto">
      <div className="flex p-1 md:p-4 flex-col">
        <div className="pb-10">
          <h2 className="font-bold">{task.title}</h2>
        </div>
        <img
          src={`https://pub-3532cc3aaee14e1e87ea82691c7b0805.r2.dev/${task.imageURL}`}
          width={1200}
          height={700}
          alt={task.title}
        />
      </div>
    </div>
  );
};

export default SingleBlog;
