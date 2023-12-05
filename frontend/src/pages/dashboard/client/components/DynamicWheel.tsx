import React, {useEffect, useState} from "react";
import styles from "@/styles/pages/dashboards/clientDashboard.module.css";
import {Button} from "antd";
import {RedoOutlined} from "@ant-design/icons";

interface DynamicWheelProps {
    data: any;
    playGame: boolean;
    onFinishedWheel: () => void;
    winningSegment : any;
}

const DynamicWheel = ({ data, playGame , onFinishedWheel , winningSegment }: DynamicWheelProps) => {
    const [Wheel, setWheel] = useState(null);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [rerender, setRerender] = useState(0);

    const handleSpinClick = () => {
        const options = [
            { option: 'Infuseur à thé' },
            { option: '100g d’un thé détox ou d’infusion' },
            { option: '100g d’un thé signature' },
            { option: 'Coffret à 39€' },
            { option: 'Coffret à 69€' },
        ];

        setMustSpin(false);

        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * options.length);
            console.log("New prize number:", newPrizeNumber);

            setMustSpin(true);
        }
    };

    useEffect(() => {

        console.log("WinningWinning segment:", winningSegment);
        const loadDynamicWheel = async () => {
            try {
                const module = await import("react-custom-roulette");
                const { Wheel } = module;

                setWheel(
                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={parseInt(winningSegment)-1}
                        data={data}
                        radiusLineColor={"#ffffff"}
                        outerBorderColor={"#d2ca72"}
                        innerBorderColor={"#312e2e"}
                        innerRadius={10}
                        radiusLineWidth={2}
                        textDistance={60}
                        spinDuration={0.2}
                        fontWeight={"500"}
                        onStopSpinning={() => {
                            onFinishedWheel();
                        }}




                    /> as any
                );
                setRerender((prev) => prev + 1);
            } catch (err) {
                console.error(err);
            }
        };

        loadDynamicWheel();
    }, [mustSpin, prizeNumber]);

    return (
        <div className={`${styles.wheelDiv}`}>
            {Wheel}
            <Button
                className={`${styles.spinButton} mt-5`}
                type={"primary"}
                onClick={handleSpinClick}>
                Tourner la roue ! <RedoOutlined className={`mx-2`} />
            </Button>
        </div>
    );
};

export default DynamicWheel;
