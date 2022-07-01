import React, {useState, useEffect} from 'react';
import * as Utils from "../../constants/utils";

interface CountUpProps {
    totalNumber: number;
    countUpCheck: boolean;
    duration?: number;
}

const easeOutQuad = (t: number) => t * (2 - t);
const frameDuration = 1000 / 60;

export const CountUp = ({ totalNumber, countUpCheck = false, duration = 1500 }: CountUpProps) => {
    const [count, setCount] = useState<number>(0);

    //##################################################################################################################
    //##
    //## >> Override
    //##
    //##################################################################################################################

    useEffect( () => {
        if (!countUpCheck) {
            return;
        }
        let frame = 0;
        const totalFrames: number = Math.round(duration / frameDuration);
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            setCount(totalNumber * progress);
            if (frame === totalFrames) {
                clearInterval(counter);
            }
        }, frameDuration);
        return () => {
            clearInterval(counter);
        }

    }, [countUpCheck]);


    //##################################################################################################################
    //##
    //## >> Method : Default Rendering
    //##
    //##################################################################################################################

    return (
        <>
            {Utils.numberWithCommas(Math.floor(count))}
            {/* {countUpCheck && "dfdafsd"} */}
        </>
    );
};

export default React.memo(CountUp);