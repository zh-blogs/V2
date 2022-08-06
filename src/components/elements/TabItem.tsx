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
        'text-[18px] font-medium active:border-0 my-4 transition-colors',
        selected
          ? 'text-[#3C3C3C] border-[#3C3C3C] border-b-2'
          : 'text-[#9E9E9E] hover:border-[#9E9E9E] hover:border-b-2 active:text-[#3C3C3C]',
      )}
      to={to}
    >
      {children}
    </Link>
  );
};

export default TabItem;
