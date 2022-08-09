import { Transition } from '@headlessui/react';
import { LoadingOne } from '@icon-park/react';
import { useIsFetching } from '@tanstack/react-query';

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchingCount = useIsFetching();

  return (
    <>
      <Transition
        show={fetchingCount > 0}
        className="fixed top-2 text-center w-full transition-all duration-300"
        enterFrom="-translate-y-1 opacity-0"
        enterTo="translate-y-0.5 opacity-100"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="-translate-y-0.5 opacity-0"
      >
        <div className="bg-[#F3F0E7] text-[#3C3C3C] shadow-xl rounded-full py-2 px-5 w-fit mx-auto">
          <span className="mr-2">加载中</span>
          <LoadingOne className="[&>*]:animate-spin" />
        </div>
      </Transition>
      {children}
    </>
  );
};

export default LoadingProvider;
