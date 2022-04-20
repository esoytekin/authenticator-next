import { useEffect, useState } from 'react';
import TOTP from '../lib/totp';

function useCountdownTimer() {
    const [counter, setCounter] = useState(TOTP.getTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(TOTP.getTime());
        }, 1000);

        return function () {
            clearInterval(interval);
        };
    }, []);

    return counter;
}

export default useCountdownTimer;
