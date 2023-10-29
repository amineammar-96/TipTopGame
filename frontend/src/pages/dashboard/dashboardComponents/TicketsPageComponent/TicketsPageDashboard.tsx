import React, {useRef, useState, useEffect} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import {Card, Col, Row, Spin} from 'antd';
import Image from 'next/image';
import BarcodeTicketImg from "@/assets/images/barcodeTicket.png";
import InfuserImg from "@/assets/images/infuser.png";
import TeaBoxImg from "@/assets/images/teaBox.png";
import TeaBoxSignatureImg from "@/assets/images/teaBoxSignature.png";
import SurprisePlusImg from "@/assets/images/surprisePlus.png";
import SurpriseBoxImg from "@/assets/images/surprise.png";
import {getTickets , getPrizes} from "@/app/api";
import LogoutService from "@/app/service/LogoutService";
import {Button, Form, Input, Select, Space, theme} from 'antd';
import {DownOutlined, EyeOutlined} from "@ant-design/icons";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import {Tag } from 'antd';
const {Option} = Select;
import {Pagination} from 'antd';
import StoresList from "@/pages/dashboard/dashboardComponents/TicketsPageComponent/StoresList";

interface DataType {
    id: string;
    ticket_code: string;
    prize: {
        id: string;
        label: string;
        name: string;

    };
    status: string;
    ticket_printed_at: {
        date: string;
        time: string;
    };
    win_date: {
        date: string;
        time: string;
    };
    ticket_generated_at: {
        date: string;
        time: string;
    };
    client: string;
    caissier: string;
    store: string;


}

interface PrizeType {
    'id' : string;
    'label' : string;
    'name' : string;
    'type' : string;
    'prize_value' : string;
    'winning_rate' : string;
}


interface SearchParams {
    page: string;
    limit: string;
    store: string;
    user: string;
    status: string;
    caissier: string;
    client: string;
    sort: string;
    order: string;
    ticket_code: string;
    prize: string;
}

const defaultSearchParams: SearchParams = {
    page: '1',
    limit: '12',
    store: '',
    user: '',
    status: '',
    caissier: '',
    client: '',
    sort: '',
    order: '',
    ticket_code: '',
    prize: '',
};

function TicketsPageDashboard() {

    const {logoutAndRedirectAdminsUserToLoginPage} = LogoutService();

    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [searchParam, setSearchParam] = useState<SearchParams>(defaultSearchParams);
    const [totalTicketsCount, setTotalTicketsCount] = useState(0);

    function fetchData() {
        setLoading(true);
        getTickets(searchParam).then((response) => {
            console.log('response : ', response);
            setData(response.tickets);
            setTotalTicketsCount(response.totalCount);
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

    useEffect(() => {
        fetchData();
    }, [searchParam]);

    //getTicketStatusLabel
    const getTicketStatusLabel = (status: string) => {
        console.log('status : ', status=="1");
        switch (status) {
            case "1":
                return 'Ticket Généré';
            case "2":
                return 'Ticket Imprimé';
            case "3":
                return 'Ticket en attente de vérification';
            case "4":
                return 'Ticket Gagnant';
            case "5":
                return 'Ticket Expiré';
            case  "6":
                return 'Ticket Annuler';
            default:
                return 'Inconnu';
        }

    }

    const renderPrizeImage = (prizeId: string) => {
        switch (prizeId.toString()) {
            case "1":
                return (
                    <Image src={InfuserImg} alt={"Infuseur"}></Image>
                );
            case "2":
                return (
                    <Image src={TeaBoxImg} alt={"Infuseur"}></Image>
                );
            case "3":
                return (
                    <Image src={TeaBoxSignatureImg} alt={"Infuseur"}></Image>
                );
            case "4":
                return (
                    <Image src={SurpriseBoxImg} alt={"Infuseur"}></Image>
                );
            case "5":
                return (
                    <Image src={SurprisePlusImg} alt={"Infuseur"}></Image>
                );
            default:
                return (<></>);
        }
    }

    const renderTickets = () => {
        if (data) {
            return data.map((ticket, key) => {
                return (
                    <Col key={key} className={`w-100 d-flex mt-5`} xs={24} sm={24} md={8} lg={6} span={6}>
                        <div className={`${styles.ticketCardElement}`}>

                            <div className={`${styles.ticketCardBody}`}>
                                <div className={`${styles.ticketCardText} mb-1`}>
                                    <p className={`${styles.ticketStatusTag}
                                     ${ticket.status=="1" && styles.ticketStatusTagGenerated}
                                        ${ticket.status=="2" && styles.ticketStatusTagPrinted}
                                        ${ticket.status=="3" && styles.ticketStatusTagWaiting}
                                        ${ticket.status=="4" && styles.ticketStatusTagWin}
                                        ${ticket.status=="5" && styles.ticketStatusTagExpired}
                                        ${ticket.status=="6" && styles.ticketStatusTagCanceled}
                                     `}>
                                        {ticket.status=="1" && (
                                            <Tag icon={<CheckCircleOutlined />} color="success">
                                                {getTicketStatusLabel(ticket.status.toString())}
                                            </Tag>

                                        )}
                                        {ticket.status=="2" && (
                                            <Tag icon={<SyncOutlined spin />} color="processing">
                                                {getTicketStatusLabel(ticket.status.toString())}
                                            </Tag>

                                        )}
                                        {ticket.status=="3" && (
                                            <Tag icon={<CloseCircleOutlined />} color="error">
                                                {getTicketStatusLabel(ticket.status.toString())}
                                            </Tag>

                                        )}
                                        {ticket.status=="4" && (
                                            <Tag icon={<ExclamationCircleOutlined />} color="warning">
                                                {getTicketStatusLabel(ticket.status.toString())}
                                            </Tag>

                                        )}
                                        {ticket.status=="5" && (
                                            <Tag icon={<ClockCircleOutlined />} color="default">
                                                {getTicketStatusLabel(ticket.status.toString())}
                                            </Tag>

                                        )}


                                    </p>

                                    <p className={`${styles.barCode}`}><strong>Code de Ticket:</strong> <span className={styles.barCodeText}>#{ticket.ticket_code} <div className={`${styles.ticketCardIconsBarCode}`}>
                                        <Image src={BarcodeTicketImg} alt={"Code a barre"}></Image>
                                    </div>
                                    </span></p>


                                    <p><strong>Gain:</strong></p>
                                    <div className={`${styles.ticketCardIconsPrize}`}>
                                        {renderPrizeImage(ticket.prize.id)}
                                    </div>
                                    <p className={`${styles.prizeLabel}`}>{ticket.prize.label}</p>
                                    {ticket.status=="1" && (
                                        <p className={`mt-5 ${styles.prizeDateGeneration}`}><strong>Date de Génération:</strong>Le {ticket.ticket_generated_at.date} à {ticket.ticket_generated_at.time} </p>
                                    )}
                                    {ticket.status=="2" && (
                                        <p className={`mt-5 ${styles.prizeDateGeneration}`}><strong>Date d'impression:</strong>Le {ticket.ticket_printed_at.date} à {ticket.ticket_printed_at.time} </p>
                                    )}
                                    {ticket.status=="3" && (
                                        <p className={`mt-5 ${styles.prizeDateGeneration}`}><strong>Date de Gain:</strong>Le {ticket.win_date.date} à {ticket.win_date.time} </p>
                                    )}
                                    {/*<p><strong>Date d'impression:</strong>{ticket.ticket_printed_at}</p>
                                    <p><strong>Date de Jeu:</strong>{ticket.win_date}</p>
                                    <p><strong>Magasin:</strong> {ticket.store}</p>
                                    <p><strong>Caissier:</strong> {ticket.caissier}</p>
                                    <p><strong>Client:</strong> {ticket.client}</p>*/}

                                    <Button className={`${styles.eyeIcon} mt-3`}  title={`Plus de détails`} icon={<EyeOutlined />} size={"large"} >
                                    Consulter
                                    </Button>

                                </div>
                            </div>

                        </div>
                    </Col>

                )
            })
        }
    }

    const [selectedStoreId, setSelectedStoreId] = useState<string>('');

    const handleStoreChange = (value: string) => {
        setSelectedStoreId(value);
        setSearchParam({
            ...searchParam,
            store: value,
        });
    };

    const {token} = theme.useToken();
    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);

    const formStyle: React.CSSProperties = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };



    const renderStores = () => {
        return (
                <StoresList onSelectStore={handleStoreChange}></StoresList>
        )
    }

    const renderTicketsStatus = () => {
        return (
            <>
                <Option value="">
                    Tous les Statuts
                </Option>
                <Option  value="1">
                    Ticket Généré
                </Option>
                <Option value="2">Ticket Imprimé</Option>
                <Option value="3">Ticket en attente de vérification</Option>
                <Option value="4">Ticket Gagnant</Option>
                <Option value="5">Ticket Expiré</Option>
                <Option value="6">Ticket Annuler</Option>
            </>
        )
    }

    const [prizesList, setPrizesList] = useState<PrizeType[]>([]);
    function getAllPrizes() {
        setLoading(true);
        getPrizes().then((response) => {
            console.log('response : ', response);
            setPrizesList(response.prizes);
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

    useEffect(() => {
        getAllPrizes();
    },[]);

    const renderTicketsPrizes = () => {
        return (
            <>
                <Option value="">
                    Tous les Gains
                </Option>
                {prizesList.map((prize, key) => {
                    return (
                        <Option key={key} value={prize.id}>{prize.label}</Option>
                    )
                })}

            </>
        )
    }

    const getFields = () => {
        const count = expand ? 10 : 6;
        const children = [];
        children.push(
            <Row className={`${styles.fullWidthElement} w-100 d-flex`} gutter={24}>
                <Col span={8} key={`barCode`}>
                    <Form.Item
                        className={`${styles.formItem} searchTicketFormItem mb-5`}
                        name={`code`}
                        label={`Code de Ticket:`}
                    >
                        <Input className={`mt-2`} placeholder="Code à barre de Ticket"
                               onChange={(e) => {
                                   setSearchParam({
                                       ...searchParam,
                                       ticket_code: e.target.value,
                                   });
                               }}
                        />
                    </Form.Item>

                    <Form.Item
                        className={`${styles.formItem} searchTicketFormItem mb-5`}
                        name={`client`}
                        label={`Client`}
                        initialValue=""
                    >
                        <Input className={`mt-2`}
                               placeholder="Nom, Prénom, de Client"
                               onChange={(e) => {
                                   setSearchParam({
                                       ...searchParam,
                                       client: e.target.value,
                                   });
                               }}
                        />
                    </Form.Item>

                </Col>
                <Col span={8} key={`statusTicket`}>


                    <Form.Item
                        className={`${styles.formItem} searchTicketFormItem mb-5`}
                        name={`status`}
                        label={`Statut de Ticket`}
                        initialValue=""
                    >

                        <Select placeholder={`Tous les Statuts`} value={searchParam.status} onChange={(e) => {
                            setSearchParam({
                                ...searchParam,
                                status: e.toString(),
                            });
                        }} className={`mt-2`}>
                            {renderTicketsStatus()}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className={`${styles.formItem} searchTicketFormItem mb-5`}

                        name={`caissier`}
                        label={`Caissier`}
                        initialValue=""
                    >
                        <Input
                            className={`mt-2`}
                            placeholder="Nom, Prénom, de Caissier"
                            onChange={(e) => {
                                setSearchParam({
                                    ...searchParam,
                                    caissier: e.target.value,
                                });
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col span={8} key={`storesTicketsList`}>
                    {renderStores()}


                    {expand && (
                        <>
                            <Form.Item
                                name={`gain`}
                                label={`Gain`}
                                initialValue=""
                                className={`${styles.formItem} searchTicketFormItem mb-5`}
                            >
                                <Select onChange={
                                    (e) => {
                                        setSearchParam({
                                            ...searchParam,
                                            prize: e.toString(),
                                        });
                                    }
                                } placeholder={`Tous les Gains`
                                } className={`mt-2`}>
                                    {renderTicketsPrizes()}
                                </Select>
                            </Form.Item>
                        </>
                    )}
                </Col>


            </Row>,
        );

        return children;
    };

    const renderSearchForm = () => {
        return (
            <>
                <Form form={form} name="advanced_search" className={`${styles.searchTicketForm}`}>
                    <Row className={`${styles.fullWidthElement}`} gutter={24}>{getFields()}</Row>
                    <div className={`mt-0 w-100`} style={{textAlign: 'right'}}>
                        <Space size="small">
                            <Button
                                className={`${styles.submitButtonBlue}`}

                                onClick={() => {
                                    form.resetFields();
                                    setSearchParam(defaultSearchParams);
                                }}
                            >
                                Réinitialiser
                            </Button>
                            <a
                                className={`${styles.moreFiltersBtn} ${expand ? styles.moreFiltersBtnActive : styles.moreFiltersBtnInactive}`}
                                style={{fontSize: 12}}
                                onClick={() => {
                                    setExpand(!expand);
                                }}
                            >
                                <DownOutlined
                                    rotate={expand ? 180 : 0}/> {!expand ? 'Plus de filtres' : 'Moins de filtres'}
                            </a>
                        </Space>
                    </div>
                </Form>
            </>
        );

    }


    return (
        <div className={styles.homePageContent}>

            <div className={`${styles.homePageContentTopHeader}`}>
                <h1 className={`mx-3`}>Tickets et codes générés
                </h1>
                <div className={`${styles.ticketsCardsMain}`}>

                    <div className={`${styles.ticketsCardsDiv} mb-5 px-4`}>
                        {renderSearchForm()}

                        <Row className={`${styles.fullWidthElement}  mt-5 mb-5 w-100`}
                             gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>

                            {loading &&
                                <div className={`${styles.loadingDashboardFullPage}`}>
                                    <Spin size="large"/>
                                </div>
                            }
                            {!loading && (
                               <>
                                   <Col key={"resultTikcets"} className={`w-100 d-flex justify-content-between mt-3 px-4`} xs={24} sm={24} md={24} lg={24} span={6}>
                                    <h6>
                                        Résultat de recherche
                                    </h6>
                                       <h6>
                                           {data?.length} Utilisateur(s) trouvé(s) sur {totalTicketsCount}
                                       </h6>

                                   </Col>
                                   {renderTickets()}

                                   {totalTicketsCount==0 && (
                                        <Col key={"noResultTikcets"} className={`w-100 d-flex justify-content-between mt-3 px-4`} xs={24} sm={24} md={24} lg={24} span={6}>
                                             <h6>
                                                  Aucun ticket trouvé !
                                             </h6>
                                        </Col>

                                   )}
                               </>
                               )}

                        </Row>
                        {!loading && totalTicketsCount>0 &&
                            <Row className={`${styles.fullWidthElement} w-100 mt-5 justify-content-center`}
                                 gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>

                                <Pagination
                                    onChange={(page, pageSize) => {
                                        setSearchParam({
                                            ...searchParam,
                                            page: page.toString(),
                                            limit: pageSize.toString(),
                                        });
                                    }
                                    }
                                    defaultCurrent={parseInt(searchParam.page)} total={totalTicketsCount}/>
                            </Row>
                        }


                    </div>

                </div>
            </div>


        </div>
    );
}

export default TicketsPageDashboard;