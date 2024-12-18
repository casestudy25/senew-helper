import styles from "./Common.module.css"
import {useState} from "react";

const D8SS = "데코에잇 스마트스토어";
const D8OH = "데코에잇 홈페이지";
const D8NP = "데코에잇 네이버페이";
const ALSS = "어바웃리빙 스마트스토어";
const ALOH = "어바웃리빙 홈페이지";
const ALNP = "어바웃리빙 네이버페이";

function SoogiBuild() {
    const [receiveInfo, setReceiveInfo] = useState("");
    const [channel, setChannel] = useState(D8SS);
    const [prdName, setPrdName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [result, setResult] = useState("");

    const onChannelChanged = (event) => {
        setChannel(event.target.value);
    }

    const onProductNameChanged = (event) => {
        setPrdName(event.target.value);
    }

    const onQuantityChanged = (event) => {
        setQuantity(event.target.value);
    }

    const onAddressChanged = (event) => {
        const newText = event.target.value;
        setReceiveInfo(newText);

        if (!isProperReceiver(newText))
            return;

        setResult(getUpdatedResult(newText));
    }
    
    const onCopy = () => {
        const resultArea = document.getElementById("resultArea");
        resultArea.select();
        document.execCommand('copy');
    }

    function getUpdatedResult(newText) {
        let resultString = ""
        const split = newText.split(/\r\n|\n\r|\n|\r/);

        resultString += "수기송장발송건, \n\n";
        resultString += "수령인: ★" + split[0].substring(3, split[0].length) + "(" + channel + ")\n";
        resultString += "연락처: " + split[1].substring(3, split[1].length) + "\n";
        resultString += "배송지: " + split[2].substring(3, split[2].length) + "\n\n";
        resultString += "상품명(수량) : \n";
        resultString += `- ${prdName} (${quantity}개)`;

        return resultString;
    }

    return (
        <div>
            <h4>수령인 정보 입력</h4>
            <select value={channel} onChange={onChannelChanged}>
                <option>{D8SS}</option>
                <option>{D8OH}</option>
                <option>{D8NP}</option>
                <option>{ALSS}</option>
                <option>{ALOH}</option>
                <option>{ALNP}</option>
            </select>
            <br/>
            <br/>
            <input
                onChange={onProductNameChanged}
                value={prdName}
                type={"text"}
                placeholder={"상품명"}
            />
            <input
                type={"number"}
                placeholder={"수량"}
                value={quantity}
                onChange={onQuantityChanged}
            />
            <br/>
            <br/>
            <textarea
                onChange={onAddressChanged}
                value={receiveInfo}
                className={styles.paste_small}
                placeholder={"수령인 정보 전체 복사 붙여넣기"}
            />
            <h4>최종 결과</h4>
            <textarea
                id={"resultArea"}
                readOnly={true}
                value={result}
                className={styles.paste_big}
            />
            <br/>
            <button onClick={onCopy}>클립보드에 복사</button>
        </div>
    )
}

function isProperReceiver(receiverInfo) {
    return receiverInfo.includes("수령인") &&
        receiverInfo.includes("연락처") &&
        receiverInfo.includes("배송지");
}

export default SoogiBuild;