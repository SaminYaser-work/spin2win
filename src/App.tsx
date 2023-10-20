import "./App.css";
import Spinner from "./components/Spinner";
import NameInput from "./components/NameInput";
import { useState } from "react";

function App() {
    const [names, setNames] = useState<string[]>([]);

    console.log(names);

    function handleWinner(speed: number) {
        const pointerAngle = speed % 360;
        const sliceAngle = 360 / names.length;
        const sliceIndex = Math.floor(pointerAngle / sliceAngle);
        alert("Winner is " + names[sliceIndex]);
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
        </div>
    );
}

export default App;
