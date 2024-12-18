import { useState } from "react";
import BigNumber from "bignumber.js";
import styles from "./Common.module.css";

// BigNumber 설정
BigNumber.config({
    EXPONENTIAL_AT: [-50, 50],
    DECIMAL_PLACES: 18,
    ROUNDING_MODE: BigNumber.ROUND_DOWN
});

const UNITS = {
    wei: new BigNumber(1),
    gwei: new BigNumber(10).pow(9),
    ether: new BigNumber(10).pow(18)
};

function EthConverter() {
    const [values, setValues] = useState({
        wei: '',
        gwei: '',
        ether: ''
    });
    
    const [tempInputs, setTempInputs] = useState({
        wei: '',
        gwei: '',
        ether: ''
    });

    const formatNumber = (value, unit) => {
        if (!value) return '';
        
        try {
            const bn = new BigNumber(value);
            if (bn.isNaN()) return '';

            if (unit === 'wei') {
                return bn.integerValue(BigNumber.ROUND_DOWN).toString();
            }
            
            return bn.toString();
        } catch {
            return value;
        }
    };

    const handleChange = (unit, value) => {
        // 임시 입력값 업데이트
        const newTempInputs = {
            ...tempInputs,
            [unit]: value
        };
        setTempInputs(newTempInputs);

        // 빈 값이나 소수점만 있는 경우는 바로 반환
        if (value === '' || value === '.') {
            setValues({wei: '', gwei: '', ether: ''});
            return;
        }

        // 유효한 숫자 형식인지 검사 (정수, 소수, 소수점 진행 중)
        if (!/^[0-9]+\.?[0-9]*$|^[0-9]*\.?[0-9]+$|^\.$/.test(value)) {
            return;
        }

        try {
            const inputBN = new BigNumber(value);
            if (inputBN.isNaN()) return;

            let inWei;
            switch(unit) {
                case 'wei':
                    inWei = inputBN;
                    break;
                case 'gwei':
                    inWei = inputBN.multipliedBy(UNITS.gwei);
                    break;
                case 'ether':
                    inWei = inputBN.multipliedBy(UNITS.ether);
                    break;
                default:
                    return;
            }

            const newValues = {
                wei: formatNumber(inWei, 'wei'),
                gwei: formatNumber(inWei.dividedBy(UNITS.gwei), 'gwei'),
                ether: formatNumber(inWei.dividedBy(UNITS.ether), 'ether')
            };

            setValues(newValues);
            
            // 현재 입력 중인 필드는 원래 입력값 유지, 나머지는 계산된 값으로 업데이트
            setTempInputs({
                ...newValues,
                [unit]: value
            });
        } catch (error) {
            console.error('Invalid number input:', error);
        }
    };

    return (
        <div>
            <h2>이더리움 단위 변환기</h2>
            <div className={styles.converter_container}>
                <div className={styles.converter_item}>
                    <label className={styles.converter_label}>Wei:</label>
                    <input
                        type="text"
                        value={tempInputs.wei}
                        onChange={(e) => handleChange('wei', e.target.value)}
                        placeholder="Wei 값 입력"
                        className={styles.converter_input}
                    />
                </div>
                <div className={styles.converter_item}>
                    <label className={styles.converter_label}>Gwei:</label>
                    <input
                        type="text"
                        value={tempInputs.gwei}
                        onChange={(e) => handleChange('gwei', e.target.value)}
                        placeholder="Gwei 값 입력"
                        className={styles.converter_input}
                    />
                </div>
                <div className={styles.converter_item}>
                    <label className={styles.converter_label}>Ether:</label>
                    <input
                        type="text"
                        value={tempInputs.ether}
                        onChange={(e) => handleChange('ether', e.target.value)}
                        placeholder="Ether 값 입력"
                        className={styles.converter_input}
                    />
                </div>
            </div>
        </div>
    );
}

export default EthConverter; 