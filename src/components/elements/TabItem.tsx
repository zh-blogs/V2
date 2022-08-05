import clsx from 'clsx';

interface TabItemProps {
  children: string;
  selected?: boolean;
}

const TabItem = ({ children, selected }: TabItemProps) => {
  return (
    <button
      className={clsx(
        'text-[18px] font-bold active:border-0 my-4 transition-colors',
        selected
          ? 'text-[#3C3C3C] border-[#3C3C3C] border-b-2'
          : 'text-[#9E9E9E] hover:border-[#9E9E9E] hover:border-b-2 active:text-[#3C3C3C]',
      )}
    >
      {children}
    </button>
  );
};

export default TabItem;
