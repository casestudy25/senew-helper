import styles from "./Common.module.css";
import {useState} from "react";

const BASE_URL = "https://www.loftshop.co.kr";
// const BASE_URL = "http://www.feel-seoul.com";

function ImagePick() {
    const [textToParse, setTextToParse] = useState("");
    const [parsedImgs, setParsedImgs] = useState([]);

    const onChange = (event) => {
        const pastedText = event.target.value;
        setTextToParse(pastedText);
    }

    const onClick = (event) => {
        event.preventDefault();

        const parser = new DOMParser();
        const imgTags = [...parser.parseFromString(textToParse, "text/html").getElementsByTagName("img")];
        const tempImgs = [];

        imgTags.forEach(value => {
            const srcAttr = value.getAttribute("src");
            if (srcAttr.startsWith("/"))
                tempImgs.push(srcAttr);
        });

        setParsedImgs(tempImgs);
    };

    return (
        <div>
            <h2>Image Thief</h2>
            <textarea
                onChange={onChange}
                placeholder={"이미지가 포함된 HTML 전체 붙여넣기"}
                className={styles.paste_big}
            />
            <br/>
            <button onClick={onClick}>이미지 추출하기</button>
            <ul>
                {parsedImgs.map((item, index) => (
                    <li key={index}>
                        <a href={BASE_URL + item} target={"_blank"}>{item}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function isProperHtml(copiedHtml) {
    let isProper = true;

    if (copiedHtml === "") {
        alert("입력된 텍스트가 없습니다");
        isProper = false;
    } else if (!copiedHtml.startsWith("<html>") || !copiedHtml.endsWith("</html>")) {
        alert("입력된 텍스트의 양식을 다시 확인해주세요");
        isProper = false;
    }

    return isProper;
}

export default ImagePick;