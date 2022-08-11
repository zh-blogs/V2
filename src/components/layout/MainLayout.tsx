import { Menu, Transition } from '@headlessui/react';

import Button from '../elements/Button';

export type Actions = { name: string; action?: () => void }[];

const MobileActionsMenu = ({ actions }: { actions?: Actions }) => {
  if (actions?.length === 1) {
    return (
      <button
        className="bg-[#F9F8E0] text-[#3C3C3C] text-[8px] w-[80px] shadow-md rounded-[1px]"
        onClick={actions[0].action}
      >
        {actions[0].name}
      </button>
    );
  }

  return (
    <Menu>
      <Menu.Button className="bg-[#F9F8E0] text-[#3C3C3C] text-[8px] w-[80px] shadow-md rounded-[1px]">
        更多选项
      </Menu.Button>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute bg-[#F9F8E0] text-[#3C3C3C] text-[8px] w-[80px] shadow-md rounded-[1px] text-center mt-1">
          {actions?.map((action, index) => (
            <Menu.Item key={index}>
              {() => (
                <button
                  className="py-1 border-b-[0.5px] border-[#3C3C3C] last:border-0"
                  onClick={action.action}
                >
                  {action.name}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

interface MainLayoutProps {
  children: React.ReactNode;
  description: string;
  actions?: Actions;
}

const MainLayout = ({ children, description, actions }: MainLayoutProps) => {
  return (
    <main className="mx-[10px] lg:mx-16 flex flex-col gap-2 mt-2 mb-8 lg:gap-6 lg:mt-6 lg:mb-12">
      <div className="mx-5 lg:mx-9 flex gap-10">
        <div className="text-[#9E9E9E] font-medium flex-grow text-[8px] lg:text-base leading-7 lg:leading-6">
          {description}
        </div>
        {actions?.map((action, index) => (
          <Button
            key={index}
            onClick={action.action}
            className="hidden lg:block"
          >
            {action.name}
          </Button>
        ))}
        <div className="lg:hidden">
          <MobileActionsMenu actions={actions} />
        </div>
      </div>
      <div className="border-b-[1px] border-black"></div>
      <div>{children}</div>
    </main>
  );
};

export default MainLayout;
