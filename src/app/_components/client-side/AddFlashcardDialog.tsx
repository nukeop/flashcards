'use client';

import Button from '../Button';
import Dialog from './Dialog';
import Input from './Input';

type AddFlashcardDialogProps = {
    isOpen: boolean;
    onClose: () => void;

    onCreateFlashcard: (formData: FormData) => void;
    onCancel: () => void;
};

const AddFlashcardDialog: React.FC<AddFlashcardDialogProps> = ({
    isOpen,
    onClose,
    onCreateFlashcard,
    onCancel,
}: AddFlashcardDialogProps) => (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <form
            className="flex flex-col items-center justify-center"
            action={onCreateFlashcard}
        >
            <div className="mb-2 flex w-full flex-row justify-between bg-stone-100 px-4 py-2 text-sm text-stone-500 shadow-sm">
                <Button intent="text" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" intent="text">
                    Save
                </Button>
            </div>
            <div className="grid flex-grow grid-cols-3 gap-2 bg-stone-50 px-2 py-4">
                <label
                    className="px-2 py-1 text-sm text-stone-400"
                    htmlFor="front"
                >
                    Front
                </label>
                <Input
                    id="front"
                    as="textarea"
                    classes={{
                        root: 'col-span-2 min-h-32 w-full min-w-64 flex-grow',
                    }}
                    autoFocus
                />
                <label
                    className="px-2 py-1 text-sm text-stone-400"
                    htmlFor="back"
                >
                    Back
                </label>
                <Input
                    id="back"
                    as="textarea"
                    classes={{
                        root: 'col-span-2 min-h-32 w-full min-w-64 flex-grow',
                    }}
                />
            </div>
        </form>
    </Dialog>
);

export default AddFlashcardDialog;
