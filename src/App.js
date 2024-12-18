import {useState} from "react";
import SenewCalc from "./SenewCalc";
import SoogiBuild from "./SoogiBuild";
import EthPrice from "./EthPrice";
import EthConverter from "./EthConverter";
import styles from "./Common.module.css";

const MODE_SENEW = "새뉴 계산기";
const MODE_SOOGI = "수기 메이커";
const MODE_ETH = "이더리움 시세 조회";
const MODE_CONVERTER = "이더리움 변환기";

function App() {
    const [mode, setMode] = useState("");

    const onClick = (event) => {
        const selected = event.target.innerText;
        setMode(selected);
    }

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <header className={styles.header}>
                    <h1 className={styles.title}>개발자 도구모음</h1>
                    <div className={styles.button_container}>
                        <button 
                            className={`${styles.main_btn} ${mode === MODE_SENEW ? styles.active : ''}`} 
                            onClick={onClick}
                        >
                            {MODE_SENEW}
                        </button>
                        <button 
                            className={`${styles.main_btn} ${mode === MODE_SOOGI ? styles.active : ''}`} 
                            onClick={onClick}
                        >
                            {MODE_SOOGI}
                        </button>
                        <button 
                            className={`${styles.main_btn} ${mode === MODE_ETH ? styles.active : ''}`} 
                            onClick={onClick}
                        >
                            {MODE_ETH}
                        </button>
                        <button 
                            className={`${styles.main_btn} ${mode === MODE_CONVERTER ? styles.active : ''}`} 
                            onClick={onClick}
                        >
                            {MODE_CONVERTER}
                        </button>
                    </div>
                </header>
            </div>
            
            <main className={styles.main_content}>
                {mode && <div className={styles.content}>
                    {mode === MODE_SENEW && <SenewCalc/>}
                    {mode === MODE_SOOGI && <SoogiBuild/>}
                    {mode === MODE_ETH && <EthPrice/>}
                    {mode === MODE_CONVERTER && <EthConverter/>}
                </div>}
            </main>
        </div>
    );
}

export default App;
