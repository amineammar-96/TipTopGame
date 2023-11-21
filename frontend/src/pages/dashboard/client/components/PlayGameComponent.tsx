'use client';
import React, {useRef, useState, useEffect} from 'react';
import styles from "@/styles/pages/dashboards/clientDashboard.module.css";
import {Button, Col, Input, Row, Tag} from 'antd';
import LogoutService from "@/app/service/LogoutService";
import Image from "next/image";

import WheelGamePrizesImg from "@/assets/images/wheel_game_prizes.png";

import {Modal } from 'antd';
import {checkTicketCodeValidity, confirmTicketPlayed, getGainTicket, getGainTicketHistory} from "@/app/api";
import {GiftOutlined, NotificationFilled, PoweroffOutlined, RocketOutlined, SyncOutlined} from "@ant-design/icons";
import welcomeImg from "@/assets/images/gifs/congratulations.gif";
import welcomeImgAux from "@/assets/images/gifs/congratulationsAux.gif";
import InfuserImg from "@/assets/images/infuser.png";
import TeaBoxImg from "@/assets/images/teaBox.png";
import TeaBoxSignatureImg from "@/assets/images/teaBoxSignature.png";
import SurpriseBoxImg from "@/assets/images/surprise.png";
import SurprisePlusImg from "@/assets/images/surprisePlus.png";
import CongratulationsImg from "@/assets/images/congratulations.png";
import BalloonImg from "@/assets/images/balloon.png";
import gameWallpaperImg from "@/assets/images/gameWallpaper.png";
import BestGainsTable from "@/app/components/dashboardComponents/GameGainHistory/components/BestGainsTable";
import PrizesList from "@/pages/dashboard/client/components/PrizesList";
import DynamicWheel from "@/pages/dashboard/client/components/DynamicWheel";

interface PrizeType {
    'id' : any;
    'label' : any;
    'name' : any;
    'type' : any;
    'prize_value' : any;
    'winning_rate' : any;
    'totalCount' : any;
    'percentage' : any;
}


interface DataType {
    status: string;
    id: string;
    ticket_code: string;
    win_date: {
        date: string;
        time: string;
    };
    ticket_generated_at: {
        date: string;
        time: string;
    };
    ticket_printed_at: {
        date: string;
        time: string;
    };
    updated_at: {
        date: string;
        time: string;
    };

    employee: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        dob: string;
    };

    user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        dob: string;
    };

    store: {
        id: string;
        name: string;
        address: string;
        phone: string;
        email: string;
    };

    prize: {
        id: string;
        name: string;
        label: string;
        prize_value: string;
        winning_rate: string;
    };

}

const defaultPrize: PrizeType[] = [
    {
        'id' : "",
        'label' : "",
        'name' : "",
        'type' : "",
        'prize_value' : "",
        'winning_rate' : "",
        'totalCount' : "",
        'percentage' : "",
    }
];

interface SearchParams {
    page: string;
    limit: string;
    store: string;
    user: string;
    status: string;
    employee: string;
    client: string;
    sort: string;
    order: string;
    prize: string;
}

const defaultSearchParams: SearchParams = {
    page: '1',
    limit: '12',
    store: '',
    user: '',
    status: '4',
    employee: '',
    client: '',
    sort: '',
    order: '',
    prize: '',
};
function PlayGameComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        //setIsModalOpen(false);
        if(ticketCode != ""){
            checkCodeValidity();
        }

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const renderPrizeImage = (prizeId: string) => {
        switch (parseInt(prizeId)) {
            case 1:
                return (
                    <Image src={InfuserImg} alt={"Infuseur"}></Image>
                );
            case 2:
                return (
                    <Image src={TeaBoxImg} alt={"Infuseur"}></Image>
                );
            case 3:
                return (
                    <Image src={TeaBoxSignatureImg} alt={"Infuseur"}></Image>
                );
            case 4:
                return (
                    <Image src={SurpriseBoxImg} alt={"Infuseur"}></Image>
                );
            case 5:
                return (
                    <Image src={SurprisePlusImg} alt={"Infuseur"}></Image>
                );
            default:
                return (<></>);
        }
    }



    const onFinished = () => {
        Modal.success({
            className: 'modalSuccess',
            title: 'Félicitations !',
            content: <>
                <div className={`${styles.modalWithGifImage}`}>
                    <Image src={welcomeImgAux} alt={"Bienvenu"} className={`${styles.gifImage}`}/>
                    <Image src={welcomeImg} alt={"Bienvenu"} className={`${styles.gifImage}`}/>
                    <p>
                        Félicitations, vous avez gagné  {
                        prize[0]?.label
                    }
                    </p>
                    <Col key={"key"} className={`w-100 d-flex mt-5 ${styles.giftBox}`} xs={24} sm={24} md={12} lg={8} span={6}>
                        <div className={`${styles.ticketCardElement}`}>

                            <div className={`${styles.ticketCardBody}`}>
                                <div className={`${styles.prizeCardText} mb-1`}>
                                    <p className={`${styles.prizesTag}
                                     ${prize[0]?.id=="1" && styles.firstPrize}
                                        ${prize[0]?.id=="2" && styles.secondPrize}
                                        ${prize[0]?.id=="3" && styles.thirdPrize}
                                        ${prize[0]?.id=="4" && styles.fourthPrize}
                                        ${prize[0]?.id=="5" && styles.fifthPrize}
                                   
                                     `}>
                                        {prize[0]?.id=="1" && (
                                            <Tag icon={<GiftOutlined />} color="success">
                                                Gain ! N° {(prize[0]?.id.toString())}
                                            </Tag>

                                        )}
                                        {prize[0]?.id=="2" && (
                                            <Tag icon={<GiftOutlined />} color="success">
                                                Gain ! N° {(prize[0]?.id.toString())}
                                            </Tag>

                                        )}

                                        {prize[0]?.id=="3" && (
                                            <Tag icon={<GiftOutlined />} color="success">
                                                Gain ! N° {(prize[0]?.id.toString())}
                                            </Tag>

                                        )}
                                        {prize[0]?.id=="4" && (
                                            <Tag icon={<GiftOutlined />} color="success">
                                                Gain ! N° {(prize[0]?.id.toString())}
                                            </Tag>

                                        )}
                                        {prize[0]?.id=="5" && (
                                            <Tag icon={<GiftOutlined />} color="success">
                                                Gain ! N° {(prize[0]?.id.toString())}
                                            </Tag>

                                        )}
                                    </p>

                                    <p className={`my-3`}></p>
                                    <div className={`${styles.ticketCardIconsPrize}`}>
                                        {renderPrizeImage(prize[0]?.id)}
                                    </div>
                                    <p className={`${styles.prizeLabel}`}>{prize[0]?.label}</p>

                                    <Image src={CongratulationsImg} className={`${styles.emoji} ${styles.congEmoji}`} alt={"CongratulationsImg"}></Image>
                                    <Image src={BalloonImg} className={`${styles.emoji} ${styles.balloonEmoji}`} alt={"BalloonImg"}></Image>
                                </div>
                            </div>

                        </div>
                    </Col>

                    <p>
                        Votre code de participation est {validTicketCode}.
                    </p>
                    <p>
                       Veuillez le présenter à votre magasin pour récupérer votre cadeau.
                    </p>
                </div>
            </>,
            okText: "Continuer",
            onOk() {
                confirmTicketPlayed(ticketCode).then((response) => {
                    Modal.success({
                        className: 'modalSuccess',
                        title: 'Ticket Gagnant !',
                        content: 'Votre ticket est validé, vous pouvez récupérer votre cadeau : veuillez le présenter à votre magasin.',
                        okText: "D'accord",
                    });
                    setPlayGame(false);
                }).catch((error) => {
                    setPlayGame(false);
                    if (error.response) {
                        if (error.response.status === 401) {
                            logoutAndRedirectAdminsUserToLoginPage();
                        } else if (error.response.status === 404) {
                            Modal.error({
                                className: 'modalError',
                                title: 'Code invalide !',
                                content: 'Votre code est invalide, veuillez réessayer.',
                                okText: "D'accord",
                            });
                        }
                    }
                });
            }
        });
    }

    const {logoutAndRedirectAdminsUserToLoginPage} = LogoutService();
    const [loading, setLoading] = useState(false);

    const ref = useRef<any>(null)
    const [ticketCode, setTicketCode] = useState('');

    const [spinning, setSpinning] = useState(false);
    const [validTicketCode, setValidTicketCode] = useState('');


    const [prize, setPrize] = useState<PrizeType[]>(defaultPrize);


    const [formatPrizeByIdGlobal, setFormatPrizeById] = useState("");
    const [playGame, setPlayGame] = useState(false);



    const formatPrizeById = (prizeId: string) => {

        console.log(prizeId , "prizeIdprizeIdprizeId")

        switch (parseInt(prizeId)) {
            case 1:
                return "Infuseur à thé"
            case 2:
                return "100g d’un thé détox ou d’infusion"
            case 3:
                return "100g d’un thé signature"
            case 4:
                return "Coffret à 39€"
            case 5:
                return "Coffret à 69€"
            default:
                return "Coffret à 39€"
        }
    }


    function checkCodeValidity() {
        //setLoading(true);
        checkTicketCodeValidity(ticketCode).then((response) => {
            console.log(response.prize.id , "response.prize");
            setPrize([
                {
                    id: response.prize.id,
                    label: response.prize.label,
                    name: response.prize.name,
                    type: response.prize.type,
                    prize_value: response.prize.prize_value,
                    winning_rate: response.prize.winning_rate,
                    totalCount: response.prize.totalCount,
                    percentage: response.prize.percentage,
                },
            ]);

            console.log("response" , formatPrizeById(response.prize.id));
            let formatPrizeByIdAux = formatPrizeById(response.prize.id);
            setFormatPrizeById(formatPrizeByIdAux);
            //setLoading(false);
            setValidTicketCode(ticketCode);
            setPlayGame(true);
            setIsModalOpen(false);
            Modal.success({
                className: 'modalSuccess',
                title: 'Code valide !',
                content: 'Votre code est valide, vous pouvez tourner la roue.',
                okText: "D'accord",
            });
        }).catch((error) => {
            //setLoading(false);
            console.log(error.response.data.message);
            console.log(error.response , 'responseresponseresponse');

            if (error.response) {
                if (error.response.status === 401) {
                    logoutAndRedirectAdminsUserToLoginPage();
                } else if (error.response.status === 404) {
                    if (error.response.data.message=="Ticket already played") {
                        Modal.info({
                            className: 'modalError',
                            title: 'Code déjà joué !',
                            content: 'Votre code est plus valide, il a déjà été joué.',
                            okText: "D'accord",
                        });
                    }else {
                        Modal.error({
                            className: 'modalError',
                            title: 'Code invalide !',
                            content: 'Votre code est invalide, veuillez réessayer.',
                            okText: "D'accord",
                        });
                    }
                }
            }
        });
    }

    const [gainTicketsList, setGainTicketsList] = useState<DataType[]>([]);
    const [searchParam, setSearchParam] = useState<SearchParams>(defaultSearchParams);
    const [gainTicketsCount, setGainTicketsCount] = useState<number>(0);

    useEffect(() => {
        getGainTickets();
    }, [searchParam]);

    function getGainTickets() {
        setLoading(true);
        getGainTicketHistory(searchParam).then((response) => {
            console.log('response : ', response);
            setGainTicketsList(response.gains);
            setGainTicketsCount(response.totalCount);
            setLoading(false);
        }).catch((err) => {
            if (err.response) {
                if (err.response.status === 401) {
                    logoutAndRedirectAdminsUserToLoginPage();
                }
            } else {
                console.log(err.request);
            }
        })
    }

    const segments = [
        'Infuseur à thé',
        '100g d’un thé détox ou d’infusion',
        '100g d’un thé signature',
        'Coffret à 39€',
        'Coffret à 69€',
    ]
    const segColors = [
        '#7BC558',
        '#42B2FF',
        '#E3E94B',
        '#F6C28B',
        '#EBB3E6',
    ]

    const data = [
        { option: 'Infuseur à thé', style: { backgroundColor: '#7BC558', textColor: '#ffffff' , fontSize:13 } },
        { option: '100g (détox ou d’infusion)', style: { backgroundColor: '#42B2FF', textColor: '#ffffff' , fontSize:12 } },
        { option: '100g d’un thé signature', style: { backgroundColor: '#008080', textColor: '#ffffff' , fontSize:12 } },
        { option: 'Coffret à 39€', style: { backgroundColor: '#EBB3E6', textColor: '#ffffff', fontSize:14 } },
        { option: 'Coffret à 69€', style: { backgroundColor: '#FFD700', textColor: '#ffffff' , fontSize:14 } },
    ]

    const renderDynamicWheel = () => {
       return (
           <DynamicWheel onFinishedWheel={onFinished} winningSegment={
               prize[0]?.id
           }  key={prize[0]?.id} data={data} playGame={playGame} ></DynamicWheel>
       )
    };


    return (
        <div className={styles.homePageContent}>



            <div className={`${styles.homePageContentTopHeader}`}>
                <h1 className={`mx-3`}>
                    Tentez votre chance !
                </h1>
                <div className={`${styles.gameMain} mb-0`}>

                    <div className={`${styles.gameMainDiv} mb-0 pb-0 px-4`}>


                        <Row className={`${styles.fullWidthElement}  mt-0 mb-5 w-100 m-0 p-0`}
                             gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>

                            {!loading && (
                                <>
                                    <Col key={"gamePageCol"} className={`w-100 d-flex m-0 p-0 `} xs={24} sm={24} md={24} lg={24} span={6}>



                                            <div className={styles.gameInstructions}>



                                                {playGame && (
                                                   <>
                                                       <Button
                                                           onClick={() => {
                                                               Modal.confirm({
                                                                     className: 'modalSuccess',
                                                                     title: 'Voulez-vous quitter le jeu ?',
                                                                     content: 'Vous allez quitter le jeu, êtes-vous sûr ?',
                                                                     okText: "Oui",
                                                                     cancelText: "Non",
                                                                     onOk() {
                                                                          setPlayGame(false);
                                                                          setTicketCode("");
                                                                          setValidTicketCode("");
                                                                          setPrize(defaultPrize);
                                                                          setFormatPrizeById("");
                                                                          setIsModalOpen(false);
                                                                     }
                                                                });
                                                           }}
                                                           className={`mt-0 mb-4 ${styles.deleteStoreArrayBtn}`}
                                                           type="default"
                                                           size={"large"}
                                                       >
                                                           Quitter le jeu <PoweroffOutlined />
                                                       </Button>
                                                       <h5 className={`mb-4`}>
                                                           Votre code est valide, vous pouvez tourner la roue. <NotificationFilled />
                                                       </h5>
                                                   </>
                                                )}

                                                {!playGame && (
                                                    <>
                                                        <Button
                                                            onClick={() => {
                                                                showModal();
                                                            }}
                                                            className={`mt-0 mb-4 ${styles.tryMeBtn}`}
                                                            type="default"
                                                            size={"large"}
                                                        >
                                                            Tenter ma chance <RocketOutlined />
                                                        </Button>
                                                        <h4 className={`mb-2`}>
                                                            Veuillez entrer votre code de participation pour tourner la roue.
                                                        </h4>
                                                    </>
                                                )}



                                                <h6 className={`text-dark`}>
                                                    Instructions : Comment jouer ?
                                                </h6>

                                                <ul>
                                                    <li>
                                                        1- Cliquez sur la roue pour la faire tourner.
                                                    </li>
                                                    <li>
                                                        2- Une fois la roue arrêtée, vous gagnez un cadeau.
                                                    </li>


                                                    {playGame && (
                                                        <li>
                                                            3- Votre code de participation est {validTicketCode}.
                                                        </li>
                                                    )}

                                                    {playGame && (
                                                        <li>
                                                            4- Après avoir gagné, veuillez présenter votre code de participation à votre magasin pour récupérer votre cadeau.
                                                        </li>
                                                    )}

                                                    {!playGame && (
                                                        <li>
                                                            3- Après avoir gagné, veuillez présenter votre code de participation à votre magasin pour récupérer votre cadeau.
                                                        </li>
                                                    )}


                                                </ul>


                                                <h6 className={`text-dark`}>
                                                    Cadeaux à gagner :
                                                </h6>
                                                <ul>
                                                    <li>
                                                        1- Un infuseur à thé
                                                    </li>
                                                    <li>
                                                        2- Une boite de 100g d’un thé détox ou d’infusion
                                                    </li>
                                                    <li>
                                                        3- Une boite de 100g d’un thé signature
                                                    </li>
                                                    <li>
                                                        4- Un coffret découverte à 39€
                                                    </li>
                                                    <li>
                                                        5- Un coffret découverte à 69€
                                                    </li>
                                                </ul>


                                                <div className={`${styles.wheelGamePrizesImgDiv}`}>
                                                    <Image className={`${styles.wheelGamePrizesImg} mt-2`}
                                                    src={WheelGamePrizesImg}
                                                    alt={"WheelGamePrizesImg"}
                                                    >

                                                    </Image>
                                                </div>

                                            </div>

                                        {!playGame && (
                                            <div className={`w-100 d-flex justify-content-center align-items-center flex-column`}>
                                                <Image src={gameWallpaperImg}
                                                    onClick={() => {
                                                        showModal();
                                                    }}
                                        className={`${styles.spinWheelLock}`} alt={'LockImg'} />
                                                <div className={`${styles.spinWheelTitle}`} >
                                                    <p>
                                                        Veuillez entrer votre code de participation pour tourner la roue.
                                                    </p>
                                                    <p>
                                                        Il vous reste que à cliquer sur la roue pour echanger votre code de ticket.
                                                    </p>
                                                </div>
                                        </div>
                                            )}


                                        {playGame && (
                                            <>
                                            {renderDynamicWheel()}
                                            </>
                                        )}
                                    </Col>

                                </>
                            )}

                        </Row>



                    </div>

                </div>



                    <div className={`d-flex flex-column`}>
                        <div className={`${styles.historyGainTable} ${styles.fullWidthElement}`}>
                            <BestGainsTable  key={gainTicketsCount} selectedStoreId={null} data={gainTicketsList as any} ></BestGainsTable>
                        </div>
                        <div className={`${styles.prizesCardsDiv} ${styles.fullWidthElement}`}>
                                <PrizesList></PrizesList>
                        </div>
                    </div>



            </div>

            <Modal title="Tentez votre chance" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>
                    - Veuillez entrer votre code de participation pour tourner la roue.
                </p>
                <p>
                    - Aide : Votre code de participation est composé de 10 caractères, il commence par TK et se termine par 8 caractères alphanumériques.
                </p>
                <p>
                    - Exemple : TKXXXXXXXX
                </p>

                <p>
                    - Vous pouvez trouver votre code de participation dans votre ticket de caisse.
                </p>


                <Input
                name="ticketCode"
                placeholder="Entrez votre code de participation (#Code de ticket) TKXXXXXXXX"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                >

                </Input>
                <p className={`mt-3 mb-0`}>
                    *Veuillez bien recpecter le format de votre code de participation.
                </p>

                <p className={`mt-0`}>
                    *Le ticket dois être validé par un employé pour pouvoir tourner la roue.
                </p>

            </Modal>
        </div>
    );
}

export default PlayGameComponent;