import Button from './Button';

type FormDialogContentProps = {
    onCancel: () => void;
    onSave: (formData: FormData) => void;
    children: React.ReactNode;
};

const FormDialogContent: React.FC<FormDialogContentProps> = ({
    onCancel,
    onSave,
    children,
}: FormDialogContentProps) => (
    <form className="flex flex-col items-center justify-center" action={onSave}>
        <div className="mb-2 flex w-full flex-row justify-between bg-stone-100 px-4 py-2 text-sm text-stone-500 shadow-sm">
            <Button intent="text" type="button" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit" intent="text">
                Save
            </Button>
        </div>
        {children}
    </form>
);

export default FormDialogContent;
