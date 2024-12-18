import {useState} from "react";
import styles from "./Common.module.css";

function SenewCalc() {
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

        if (!isProperHtml(textToParse))
            return;

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
            <h2>Senew Paste</h2>
            <textarea
                value={textToParse}
                onChange={onChange}
                placeholder={"HTML 전체 붙여넣기"}
                className={styles.paste_big}
            />
            <br/>
            <button onClick={onClick}>변환</button>
            <ol>
                {!isParsed ? null : resultTrs.map((item) =>
                    <li
                        className={styles.list}
                        key={item.innerText}
                    >
                        {item.querySelector("b").innerText} → &nbsp;&nbsp; ({item.querySelector("table tr td:nth-child(3)").innerHTML}) <strong
                        className={isKinto(item.innerText) ? null : styles.not_kinto}>{item.querySelector("table tr td:nth-child(4)").innerText} </strong>
                    </li>
                )}
            </ol>
            <h3 className={styles.bold_font}>{`할인 미반영 가격 ${originalTotal}`}</h3>
            <h3 className={styles.bold_font}>{`킨토 할인 후 가격 ${discountedTotal}`}</h3>
        </div>
    );
}

function isKinto(productName) {
    return productName.includes("킨토");
}

function isProperHtml(copiedHtml) {
    let isProper = true;

    if (copiedHtml === "") {
        alert("입력된 텍스트가 없습니다");
        isProper = false;
    } else if (!copiedHtml.startsWith("<html>") || !copiedHtml.endsWith("</html>")) {
        alert("입력된 텍스트의 양식을 다시 확인해주세요");
        isProper = false;
    } else if (!copiedHtml.includes("(주)새뉴")) {
        alert("올바른 새뉴 양식이 아닙니다");
        isProper = false;
    }

    return isProper;
}

export default SenewCalc;