import styles from "./App.module.css";
import {useState} from "react";

function App() {
    const [textToParse, setTextToParse] = useState("");
    const [originalTotal, setOriginalTotal] = useState(0);
    const [discountedTotal, setDiscountedTotal] = useState(0);
    const [isParsed, setIsParsed] = useState(false);
    const [resultTrs, setResultTrs] = useState([]);

    const onChange = (event) => {
        const pastedText = event.target.value;
        setTextToParse(pastedText);
    }

    const onClick = (event) => {
        event.preventDefault();

        if (textToParse === "") {
            alert("입력된 텍스트 없음");
            return;
        } else if (!textToParse.startsWith("<html>") || !textToParse.endsWith("</html>")) {
            alert("양식 재확인");
            return;
        }

        const parser = new DOMParser();
        const allHtml = parser.parseFromString(textToParse, 'text/html');
        const trs = allHtml.querySelectorAll("table#pu_main td.tb_2");

        const tempTrs = [];
        let tempOriginalTotal = 0;
        let tempDiscountTotal = 0;

        trs.forEach(tr => {
            const tempPriceStr = tr.querySelector("table tr td:last-child").innerHTML
                .replace(",", "")
                .replace("원", "");
            const tempPrice = parseInt(tempPriceStr);

            tempOriginalTotal += tempPrice;
            tempDiscountTotal += isKinto(tr.innerText) ? tempPrice * .9 : tempPrice;  // 킨토 제품만 10% 할인
            tempTrs.push(tr);
        });

        setOriginalTotal(tempOriginalTotal);
        setDiscountedTotal(tempDiscountTotal);
        setResultTrs(tempTrs);
        setIsParsed(true);
    };

    return (
        <div>
            <h1>Senew Paste</h1>
            <textarea
                value={textToParse}
                onChange={onChange}
                placeholder={"HTML 전체 붙여넣기"}
                className={styles.paste}
            />
            <br/>
            <button onClick={onClick}>변환</button>
            <ol>
                {!isParsed ? null : resultTrs.map((item) =>
                    <li key={item.innerText}>
                        {item.querySelector("b").innerText} / <strong className={isKinto(item.innerText) ? null : styles.not_kinto}>{item.querySelector("table tr td:last-child").innerText} </strong>
                    </li>
                )}
            </ol>
            <h3>{`Original price ${originalTotal}`}</h3>
            <h3>{`Discounted price ${discountedTotal}`}</h3>
        </div>
    );
}

function isKinto(productName) {
    return productName.includes("킨토");
}

export default App;
