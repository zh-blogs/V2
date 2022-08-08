import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface TabItemProps {
  children: string;
  selected?: boolean;
  to: string;
}

const TabItem = ({ children, selected, to }: TabItemProps) => {
  return (
    <Link
      className={clsx(
        'text-base lg:text-[18px] font-medium active:border-0 transition-colors underline-offset-4',
        selected
          ? 'text-[#3C3C3C] decoration-[#3C3C3C] underline'
          : 'text-[#9E9E9E] hover:decoration-[#9E9E9E] hover:underline active:text-[#3C3C3C]',
      )}
      to={to}
    >
      {children}
    </Link>
  );
};

export default TabItem;
