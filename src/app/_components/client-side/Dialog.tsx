import { Dialog as HUIDialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <HUIDialog onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-stone-900/50"
                        aria-hidden="true"
                    />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-100"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <HUIDialog.Panel className="relative flex flex-col items-center overflow-hidden rounded-lg border border-stone-300 bg-stone-50 text-stone-600 shadow-smooth">
                        {children}
                    </HUIDialog.Panel>
                </Transition.Child>
            </HUIDialog>
        </Transition>
    );
};

export default Dialog;
