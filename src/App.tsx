/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import icon from "./assets/icon.png";

import "./App.css";

function App() {
    const [dataInput, setDataInput] = useState<any>("");
    const [answer, setAnswer] = useState<any>("");

    const onClick = () => {
        const processedData = clearedData(dataInput).state.G.animTokens;
        setAnswer(mapWordsAndCovers(processedData));
    };

    const openPopUp = () => {
        chrome.windows.create({ url: "index.html", type: "popup" });
    };

    return (
        <>
            <div>
                <a href="" target="_blank">
                    <img src={icon} className="logo react" alt="React logo" />
                </a>
            </div>

            <div className="card">
                <h3>Paste data here :</h3>
                <textarea
                    style={{
                        maxWidth: "700px",
                        maxHeight: "200px",
                    }}
                    onChange={(e) => setDataInput(e.target.value)}
                    name="inputData"
                    id="inputData"
                    cols={50}
                    rows={15}
                ></textarea>
                <br />
                <button id="answerBtn" onClick={onClick}>
                    Answer
                </button>
                <button id="openPopUpBtn" onClick={openPopUp}>
                    Open Popup
                </button>

                <CardBoard answer={answer} />

                {/* <table>
                    <tr>
                        <th>Word</th>
                        <th>Color</th>
                        <th>Revealed</th>
                    </tr>
                    <tbody>
                        {answer &&
                            answer.map(
                                (item: {
                                    word: string;
                                    color: string;
                                    revealed: boolean;
                                }) => (
                                    <tr>
                                        <td>{item.word}</td>
                                        <td style={{ color: item.color }}>
                                            {item.color}
                                        </td>
                                        <td>{item.revealed.toString()}</td>
                                    </tr>
                                )
                            )}
                    </tbody>
                </table> */}
            </div>
        </>
    );
}

export default App;

function CardBoard({ answer }: any) {
    const rows = [...Array(5)]; // creates an array with 5 elements (for 5 rows)
    const cols = [...Array(5)]; // creates an array with 5 elements (for 5 columns)

    if (!answer) return <></>;
    return (
        <>
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyItems: "start",
                    alignContent: "start",
                    alignItems: "start",
                    marginTop: "10px",
                    marginBottom: "10px",
                }}
            >
                <span>Green Text: Revealed</span>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "10px",
                }}
            >
                {rows.map((_, rowIndex) =>
                    cols.map((_, colIndex) => {
                        const index = rowIndex * 5 + colIndex;
                        const item = answer[index];

                        return (
                            <div
                                key={index}
                                style={{
                                    fontWeight: "bold",
                                    padding: "20px",
                                    border: "1px solid #ddd",
                                    backgroundColor: item.color ?? "gray",
                                    color: item.revealed ? "green" : "white",
                                    borderRadius: "5px",
                                }}
                            >
                                {item.word}
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

const clearedData = (rawData: string) => {
    const syncIndex = rawData.indexOf('["sync"');
    if (syncIndex !== -1) {
        const syncPart = rawData.substring(syncIndex);
        return JSON.parse(syncPart)[2];
    } else {
        console.error("Sync not found.");
    }
};

function mapWordsAndCovers(dataSet: any) {
    const wordCardMap: any = {};
    const coverCardMap: any = {};

    dataSet.forEach((item: any) => {
        const idParts = item.id.split("/");
        if (item.type === "wordCard") {
            wordCardMap[idParts[1]] = item;
        } else if (item.type === "coverCard") {
            coverCardMap[idParts[2]] = item;
        }
    });

    const result = [];
    for (const key in wordCardMap) {
        if (key in coverCardMap) {
            result.push({
                word: wordCardMap[key].data.word,
                color: coverCardMap[key].data.color,
                revealed: wordCardMap[key].data.revealed,
            });
        }
    }

    return result;
}

