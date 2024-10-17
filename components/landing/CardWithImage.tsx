import React from 'react';
import Image from 'next/image';

interface CardWithImageProps {
  imageUrl: string;
  title: string;
  description: string;
}

const CardWithImage: React.FC<CardWithImageProps> = ({ imageUrl, title, description }) => {
  return (
    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
      <div className="absolute inset-0">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" className="rounded-t-lg" />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm overflow-y-auto" style={{ maxHeight: 'calc(100% - 3rem)' }}>{description}</p>
      </div>
    </div>
  );
};

export default CardWithImage;