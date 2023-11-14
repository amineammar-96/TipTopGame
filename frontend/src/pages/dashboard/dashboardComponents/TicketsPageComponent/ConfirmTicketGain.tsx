import React, {useRef, useState, useEffect} from 'react';
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import {Card, Col, Modal, Row, Spin} from 'antd';
import Image from 'next/image';
import BarcodeTicketImg from "@/assets/images/barcodeTicket.png";
import InfuserImg from "@/assets/images/infuser.png";
import TeaBoxImg from "@/assets/images/teaBox.png";
import TeaBoxSignatureImg from "@/assets/images/teaBoxSignature.png";
import SurprisePlusImg from "@/assets/images/surprisePlus.png";
import SurpriseBoxImg from "@/assets/images/surprise.png";
import {getTickets, getPrizes, getStoreClientsList, confimGainTicket} from "@/app/api";
import LogoutService from "@/app/service/LogoutService";
import {Button, Form, Input, Select, Space, theme} from 'antd';
import {DownOutlined, EyeOutlined, GiftOutlined, PrinterOutlined} from "@ant-design/icons";
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
    updated_at: {
        date: string;
        time: string;
    }
    ticket_generated_at: {
        date: string;
        time: string;
    };
    client: string;
    caissier: string;
    store: string;
    user: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        phone: string;
    };


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
    status: '3',
    caissier: '',
    client: '',
    sort: '',
    order: '',
    ticket_code: '',
    prize: '',
};

function ConfirmTicketGain() {

    const {logoutAndRedirectAdminsUserToLoginPage} = LogoutService();

    const [data, setData] = useState<DataType[]>();
    const [loading, setLoading] = useState(false);
    const [searchParam, setSearchParam] = useState<SearchParams>(defaultSearchParams);
    const [totalTicketsCount, setTotalTicketsCount] = useState(0);
    const [userRole , setUserRole] = useState<string | null>('');
    useEffect(() => {
        setUserRole(localStorage.getItem('loggedInUserRole'));
    }, []);

    async function fetchData() {
        setLoading(true);
        await getTickets(searchParam).then((response) => {
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

    const confirmGain = (ticketId: string , ticketPrizeId: string , ticketPrizeLabel : string, ticketCode : string, lastname:string, firstname:string, email:string) => {
        Modal.confirm({
            title: 'Confirmation de gain',
            content:
                <>
                    <p><strong>Client:</strong> {firstname} {lastname}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Gain:</strong></p>
                    <div className={`${styles.ticketCardIconsPrize}`}>
                        {renderPrizeImage(ticketPrizeId)}
                    </div>
                    <p className={`${styles.prizeLabel} mb-5`}>{ticketPrizeLabel}</p>
                    <p>Vous êtes sur le point de confirmer le gain de ce ticket
                        <strong> #{ticketCode}</strong> !
                    </p>
                    <p>
                        Veuillez confirmer que le client a bien reçu son gain.
                    </p>

            </>,
            okText: 'Confirmer',
            cancelText: 'Annuler',
            onOk: () => {
                confimGainTicket(ticketId).then((response) => {
                    Modal.success({
                        title: 'Confirmation de gain',
                        content: 'Le gain a été confirmé avec succès !',
                        okText: 'Fermer',
                        cancelText: 'Annuler',
                        onOk: () => {
                            fetchData();
                        },
                    });
                }).catch((err) => {
                    Modal.error({
                        title: 'Confirmation de gain',
                        content: 'Une erreur est survenue lors de la confirmation de gain !',
                        okText: 'Fermer',
                        cancelText: 'Annuler',
                    });
                    if (err.response) {
                        if (err.response.status === 401) {
                            logoutAndRedirectAdminsUserToLoginPage();
                        }
                    } else {
                        Modal.error({
                            title: 'Confirmation de gain',
                            content: 'Une erreur est survenue lors de la confirmation de gain !',
                            okText: 'Fermer',
                            cancelText: 'Annuler',
                        });
                        console.log(err.request);
                    }
                })
            },
            onCancel: () => {
                console.log('Cancel');
            },
        });
    }

    const renderTickets = () => {
        if (data) {
            return data.map((ticket, key) => {
                return (
                    <Col key={key} className={`w-100 d-flex mt-5`} xs={24} sm={24} md={12} lg={8} span={8}>
                        <div className={`${styles.ticketCardElement}`}>

                            <div className={`${styles.ticketCardBody}`}>
                                <div className={`${styles.ticketCardTextOneTicket} mb-1`}>
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
                                            <Tag icon={<PrinterOutlined />} color="success">
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

                                    <p className={`${styles.prizeDatesTextAux} mt-5 mb-0 pb-0`}>
                                        <strong>Code de Ticket:</strong>
                                    </p>
                                    <p className={`${styles.barCode} mt-0 pt-0`}><span className={styles.barCodeText}>#{ticket.ticket_code} <div className={`${styles.ticketCardIconsBarCode}`}>
                                        <Image src={BarcodeTicketImg} alt={"Code a barre"}></Image>
                                    </div>
                                    </span></p>


                                    {ticket.status=="4" &&  (
                                        <>
                                            <p><strong>Gain:</strong></p>
                                            <div className={`${styles.ticketCardIconsPrize}`}>
                                                {renderPrizeImage(ticket.prize.id)}
                                            </div>
                                            <p className={`${styles.prizeLabel}`}>{ticket.prize.label}</p>
                                        </>
                                    )}

                                    {ticket.status=="1" && (
                                        <p className={`mt-5 ${styles.prizeDatesTextAux}`}><strong>Date de Génération:</strong>Le {ticket.ticket_generated_at.date} à {ticket.ticket_generated_at.time} </p>
                                    )}
                                    {ticket.status=="2" && (
                                        <p className={`mt-5 ${styles.prizeDatesTextAux}`}><strong>Date d'impression:</strong>Le {ticket.ticket_printed_at.date} à {ticket.ticket_printed_at.time} </p>
                                    )}
                                    {ticket.status=="3" && (
                                        <>
                                            <p className={`mt-5 ${styles.prizeDatesTextAux}`}><strong>Date de jeu:</strong>Le {ticket.updated_at.date} à {ticket.updated_at.time} </p>
                                            <p className={`mt-2 ${styles.prizeDatesTextAux}`}><strong>Participant:</strong> {ticket.user.lastname} {ticket.user.firstname} </p>
                                            <p className={`mt-2 ${styles.prizeDatesTextAux}`}><strong>Participant ID :</strong> #{ticket.user.id}  </p>
                                            <p className={`mt-2 ${styles.prizeDatesTextAux}`}><strong>Participant E-mail :</strong> {ticket.user.email}  </p>
                                            <p className={`mt-2 ${styles.prizeDatesTextAux}`}><strong>Participant N° Tel :</strong> {ticket.user.phone}  </p>
                                            <p className={`mt-2 ${styles.prizeDatesTextAux}`}><strong>Date de Gain:</strong>Le {ticket.win_date.date} à {ticket.win_date.time} </p>




                                        </>
                                    )}
                                    {ticket.status=="4" && (
                                        <p className={`mt-5 ${styles.prizeDatesTextAux}`}><strong>Date de Gain:</strong>Le {ticket.win_date.date} à {ticket.win_date.time} </p>
                                    )}


                                    {ticket.status=="3" && (
                                    <Button
                                        onClick={() => {
                                            confirmGain(ticket.id , ticket.prize.id,
                                            ticket.prize.label , ticket.ticket_code , ticket.user.lastname , ticket.user.firstname , ticket.user.email);
                                        }}
                                        className={`${styles.confirmGainBtn} mt-5`}  title={`Consulter et confirmer le gain`}  size={"large"} >
                                    Consulter et confirmer le gain <GiftOutlined />
                                    </Button>

                                    )}


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

    const [form] = Form.useForm();
    const [expand, setExpand] = useState(false);




    const [prizesList, setPrizesList] = useState<PrizeType[]>([]);
    function getAllPrizes() {
        setLoading(true);
        getPrizes().then((response) => {
            console.log('response : ', response);
            setPrizesList(response.prizes);
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

    const [userStoreId , setUserStoreId] = useState<string>('');
    const [clientsList , setClientsList] = useState<any[]>([]);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        setUserStoreId(user['store'][0][0]['id']);
    }, []);


    useEffect(() => {
        if(userStoreId != '' && userStoreId != null){
            getStoreClientsList(userStoreId).then((response) => {
                console.log('response : ', response);
                setClientsList(response.users);
            });
        }
    }, [userStoreId]);


    const onChangeClientList = (value: string) => {
        setSearchParam({
            ...searchParam,
            client: value,
        });
    };

    const onSearchClientList = (value: string) => {    }
    const filterOption = (input: string, item: any) => (item?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const getFields = () => {
        const count = expand ? 10 : 6;
        const children = [];
        children.push(
            <Row className={`${styles.fullWidthElement} w-100 d-flex`} gutter={24}>
                <Col span={24} key={`barCode`}>
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
                </Col>

                <Col span={24} key={`client`}>
                    <Form.Item
                        className={`${styles.formItem} searchTicketFormItem mb-5`}
                        name={`client`}
                        label={`Client`}
                        initialValue=""
                    >
                        <Select showSearch
                                onChange={onChangeClientList}
                                onSearch={onSearchClientList}
                                filterOption={filterOption as any}
                                className={`mt-2`} placeholder="Choisir un client"
                                notFoundContent={
                                <span className={`m-4`}>Aucun client trouvé</span>
                        }
                        >
                            <Option value="" label={`Tous les clients`}>
                                Tous les clients
                            </Option>
                            {clientsList.map((client, key) => (
                                <Option key={key} value={client.id} label={`${client.lastname} ${client.firstname}`}>
                                    {`${client.lastname} ${client.firstname}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>


            </Row>,
        );

        return children;
    };

    const renderSearchForm = () => {
        return (
            <>
                <Form form={form} name="advanced_search" className={`${styles.searchOneTicketForm}`}>
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
                        </Space>
                    </div>
                </Form>
            </>
        );

    }


    return (
        <div className={styles.homePageContent}>

            <div className={`${styles.homePageContentTopHeader}`}>
                <h1 className={`mx-3`}>
                    Confirmer un gain
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
                                           {data?.length} Ticket(s) trouvé(s) sur {totalTicketsCount}
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

export default ConfirmTicketGain;