import React from 'react';

interface CardItemProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const CardItem: React.FC<CardItemProps> = ({ title, value, icon }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md flex items-center justify-between bg-sky-950">
      <div>
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
      {icon && <div className="text-white text-2xl">{icon}</div>}
    </div>
  );
};

export default CardItem;
