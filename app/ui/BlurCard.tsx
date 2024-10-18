import Link from 'next/link';
import Image from 'next/image';

type BlurCardProps = {
  href: string;
  title: string;
  date: string
  backgroundImage: string;
};

const BlurCard: React.FC<BlurCardProps> = ({ href, title, date, backgroundImage }) => {
  return (
    <Link href={href} className="shadow-lg">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover filter blur-sm"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-top justify-end p-20">
        <h1 className="font-bold text-white">{title}</h1>
        <h3 className="font-base text-white">{date}</h3>
      </div>
    </Link>
  );
};

export default BlurCard;