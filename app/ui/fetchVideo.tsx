"use client";
export const runtime = 'edge';
import React, { useEffect, useState } from 'react';

interface SingleBlogProps {
  params: {
    slug: string;
  };
}
interface Blog {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
    image: string;
    description: string;
  };
  content: string;
}

const SingleBlog: React.FC<SingleBlogProps> = ({ params }) => {
  const { slug } = params;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`https://taku-log-api.tq5tmhpyr9.workers.dev/api/blog?slug=${slug}`);  //自分で考えることが大事、blog api　が blogsで指定されてた
        if (response.ok) {
          const data: Blog = await response.json();
          setBlog(data);
        } else {
          console.error('Failed to fetch blog');
        }
      } catch (error) {
        console.error('An error occurred while fetching the blog:', error);
      }
    };

    fetchBlog();
  }, [slug]);

  if (!blog) {
    return <div className='w-full h-full flex justify-center items-center'>loading...</div>;
  }

  return (
    <div className="flex flex-col px-8 sm:px-[60px] lg:px-[100px] ml-auto mr-auto">
      <h1 className="pt-10 pb-10 text-gray-400">Blog</h1>
      <div className="flex p-1 md:p-4 flex-col">
        <div className="pb-10">
          <h2 className="font-bold">{blog.frontMatter.title}</h2>
          <div className="flex">
            <p className="text-[20px] text-gray-400">{blog.frontMatter.date}</p>
          </div>
        </div>
        <img
          src={blog.frontMatter.image}
          width={1200}
          height={700}
          alt={blog.frontMatter.title}
        />
        <div className="container" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
};

export default SingleBlog;
