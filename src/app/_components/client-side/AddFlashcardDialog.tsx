'use client';

import Button from '../Button';
import FormDialogContent from '../FormDialogContent';
import Dialog from './Dialog';
import Input from './Input';

type AddFlashcardDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onSave: (formData: FormData) => void;
};

const AddFlashcardDialog: React.FC<AddFlashcardDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    onCancel,
}: AddFlashcardDialogProps) => (
    <Dialog isOpen={isOpen} onClose={onClose}>
        <FormDialogContent onCancel={onCancel} onSave={onSave}>
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
        </FormDialogContent>
    </Dialog>
);

export default AddFlashcardDialog;
