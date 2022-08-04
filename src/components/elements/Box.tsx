import clsx from 'clsx';

interface BoxProps {
  children?: React.ReactNode;
  className?: string;
}

const Box = ({ children, className }: BoxProps) => {
  return (
    <div className={clsx('bg-[#F3F0E7] shadow-lg', className)}>{children}</div>
  );
};

export default Box;
