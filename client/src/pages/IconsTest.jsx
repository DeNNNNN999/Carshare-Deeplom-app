import * as FiIcons from 'react-icons/fi';
import { useState } from 'react';

const IconsTest = () => {
  const [iconList] = useState(Object.keys(FiIcons));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Icons from react-icons/fi</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {iconList.map((iconName) => {
          const IconComponent = FiIcons[iconName];
          return (
            <div key={iconName} className="bg-white p-4 rounded shadow flex flex-col items-center">
              <IconComponent className="text-2xl mb-2" />
              <span className="text-sm">{iconName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconsTest;
