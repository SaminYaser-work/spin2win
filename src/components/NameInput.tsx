interface NameInputProps {
    setNames: (names: string[]) => void;
}

export default function NameInput({ setNames }: NameInputProps) {
    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const names = event.target.value.split("\n");
        setNames(names);
    }

    return (
        <div>
            <h2>Add Names</h2>
            <textarea
                placeholder="Enter names here"
                onChange={handleChange}
                rows={20}
                cols={50}
                style={{
                    fontSize: "16px",
                    paddingInline: "30px",
                    paddingBlock: "30px",
                    borderRadius: "5px",
                    lineHeight: "1.5",
                    fontFamily: "sans-serif",
                    resize: "none"
                }}
            />
        </div>
    );
}
