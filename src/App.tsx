import "./App.css";
import Spinner from "./components/Spinner";
import NameInput from "./components/NameInput";
import {ElementRef, useRef, useState} from "react";

function App() {
    const [names, setNames] = useState<string[]>([]);
    const [winner, setWinner] = useState<string>("");
    const dialogRef = useRef<ElementRef<'dialog'>>(null);

    function handleWinner(speed: number) {
        const pointerAngle = speed % 360;
        const sliceAngle = 360 / names.length;
        const sliceIndex = Math.floor(pointerAngle / sliceAngle);
        setWinner(names[sliceIndex]);
        dialogRef.current?.showModal();
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "200px",
            }}
        >
            {names.length > 1 ? (
                <Spinner names={names} handleWinner={handleWinner} />
            ) : (
                <h2>Add at least 2 names</h2>
            )}
            <NameInput setNames={setNames} />
            <dialog ref={dialogRef} open={undefined}>
                <div className={"dialog"}>
                    <h1>{winner} is the Winner!</h1>
                    <button className={"dialog__close-btn"} type={"button"} onClick={(event) => {
                        event.preventDefault();
                        dialogRef.current?.close();
                        setWinner("");
                    }}>&#10005;</button>
                </div>
            </dialog>
        </div>
    );
}

export default App;
