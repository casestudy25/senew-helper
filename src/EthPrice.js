import { useState, useEffect } from "react";
import styles from "./Common.module.css";

function EthPrice() {
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchEthPrice = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=krw,usd');
            const data = await response.json();
            
            setPrice({
                krw: data.ethereum.krw.toLocaleString(),
                usd: data.ethereum.usd.toLocaleString()
            });
            setLastUpdate(new Date().toLocaleString());
            setError(null);
        } catch (err) {
            setError('시세 정보를 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEthPrice();
    }, []);

    return (
        <div>
            <h2>이더리움 시세</h2>
            {loading && <p>로딩중...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {price && (
                <div className={styles.price_container}>
                    <div className={styles.price_item}>
                        <span className={styles.price_label}>KRW:</span>
                        <span className={styles.price_value}>₩ {price.krw}</span>
                    </div>
                    <div className={styles.price_item}>
                        <span className={styles.price_label}>USD:</span>
                        <span className={styles.price_value}>$ {price.usd}</span>
                    </div>
                    {lastUpdate && (
                        <div className={styles.last_update}>
                            마지막 업데이트: {lastUpdate}
                        </div>
                    )}
                    <button 
                        onClick={fetchEthPrice}
                        className={styles.refresh_btn}
                        disabled={loading}
                    >
                        {loading ? '갱신 중...' : '수동 갱신'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default EthPrice; 