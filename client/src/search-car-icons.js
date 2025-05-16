// Проверка доступных иконок автомобилей в разных наборах react-icons
import * as FiIcons from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as IoIcons5 from 'react-icons/io5';
import * as TbIcons from 'react-icons/tb';
import * as BsIcons from 'react-icons/bs';

// Поиск иконок, содержащих "car" или "automobile" в имени
const findCarIcons = (iconSet, prefix) => {
  return Object.keys(iconSet)
    .filter(iconName => 
      iconName.toLowerCase().includes('car') || 
      iconName.toLowerCase().includes('auto') ||
      iconName.toLowerCase().includes('vehicle')
    )
    .map(iconName => `${prefix}:${iconName}`);
};

console.log('Car icons in Fi:', findCarIcons(FiIcons, 'Fi'));
console.log('Car icons in Fa:', findCarIcons(FaIcons, 'Fa'));
console.log('Car icons in Md:', findCarIcons(MdIcons, 'Md'));
console.log('Car icons in Ai:', findCarIcons(AiIcons, 'Ai'));
console.log('Car icons in Io:', findCarIcons(IoIcons, 'Io'));
console.log('Car icons in Io5:', findCarIcons(IoIcons5, 'Io5'));
console.log('Car icons in Tb:', findCarIcons(TbIcons, 'Tb'));
console.log('Car icons in Bs:', findCarIcons(BsIcons, 'Bs'));
