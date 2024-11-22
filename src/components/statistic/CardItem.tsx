import React from 'react';

interface CardItemProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const CardItem: React.FC<CardItemProps> = ({ title, value, icon }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md flex items-center justify-between bg-white">
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-gray-500 text-2xl">{icon}</div>}
    </div>
  );
};

export default CardItem;
