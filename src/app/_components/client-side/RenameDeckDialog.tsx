'use client';

import Button from '../Button';
import Dialog from './Dialog';
import Input from './Input';

type RenameDeckDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newName: string) => void;
};

const RenameDeckDialog: React.FC<RenameDeckDialogProps> = ({
    isOpen,
    onClose,
    onSave,
}: RenameDeckDialogProps) => {
    let newName = '';

    const handleSave = () => {
        onSave(newName);
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center justify-center p-4">
                <h3 className="mb-4 text-lg font-semibold">Rename Deck</h3>
                <Input
                    id="newDeckName"
                    placeholder="New deck name"
                    onChange={(e) => (newName = e.target.value)}
                />
                <div className="mt-4 flex w-full justify-end gap-2">
                    <Button intent="basic" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button intent="primary" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default RenameDeckDialog;
