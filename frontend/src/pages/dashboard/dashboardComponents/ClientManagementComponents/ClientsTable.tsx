import React, {useEffect, useState} from 'react';
import {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {FilterValue, SorterResult} from "antd/es/table/interface";
import {
    Button,
    Col,
    ConfigProvider,
    DatePicker,
    DatePickerProps,
    Form,
    Input, message,
    Row,
    Select, Space, Switch,
    Table,
    Tag
} from "antd";
import styles from "@/styles/pages/dashboards/storeAdminDashboard.module.css";
import {
    addNewUserForStore,
    getClients,
    getStoreUsersByRoleAndStoreId,
    getUserProdileById,
    updateUserById
} from "@/app/api";
import LogoutService from "@/app/service/LogoutService";
import {
    DeleteOutlined,
    DownloadOutlined, EditOutlined, InfoCircleOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined, PlusCircleOutlined, PlusOutlined, StopOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Modal} from 'antd';
import locale from "antd/locale/fr_FR";
import dayjs from "dayjs";
import frFR from 'antd/lib/locale/fr_FR';
interface DataType {
    id: string;
    firstname: string;
    lastname: string;
    gender: string;
    email: string;
    dateOfBirth: string;
    age: string;
    role: string;
    phone: string;
    status: string;

}

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue>;
    role?: string;
    selectedStoreId?: string;
}

type managerUserForm = {
    id?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    gender?: string;
    phone?: string;
    dateOfBirth?: string;
    role: string;
    status?: string;
}

const managerUserFormData = {
    id: "",
    firstname: '',
    lastname: '',
    email: '',
    dateOfBirth: "",
    phone: '',
    gender: "",
    role: "",
    status: "",
};
const dateFormat = 'DD/MM/YYYY';
const {Option} = Select;


interface storeManagersTableProps {
    selectedStoreId: string;
    data: DataType ;
}

function ClientTable({selectedStoreId , data}: storeManagersTableProps) {



    const {logoutAndRedirectAdminsUserToLoginPage} = LogoutService();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formRef] = Form.useForm();
    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns: ColumnsType<DataType> = [
        {
            title: 'Nom',
            dataIndex: 'lastname',

        },
        {
            title: 'Prénom',
            dataIndex: 'firstname',

        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Genre',
            dataIndex: 'gender',
            width: '20%',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Téléphone',
            dataIndex: 'phone',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (_, {status}) => (
                <>
                    {status == "1" && (
                        <Tag color={'green'} key={status}>
                            Ouvert
                        </Tag>
                    ) || status == "2" && (
                        <Tag color={'red'} key={status}>
                            Fermé
                        </Tag>
                    )}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Space size="middle">

                        <Button onClick={() => {

                        }} className={`${styles.profilDetailsBtn}`} icon={<InfoCircleOutlined />} size={"middle"}>
                            Détails
                        </Button>

                    </Space>
                </>
            ),
        },

    ];







    const customEmptyText = (
        <div className={styles.emptyTableTextDiv}>
            <span>Aucun Client trouvé
            </span>
            <span><StopOutlined /></span>
        </div>
    );


    // @ts-ignore
    return (
        <>
            <Row className={`${styles.fullWidthElement}`}>
                <Col className={styles.fullWidthElement}>
                    <ConfigProvider locale={frFR}>
                    <Table
                        className={`${styles.tableProfileManagement} tableClientManagement`}
                        locale={{emptyText : customEmptyText}}
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data as any}
                        pagination={false}
                    />
                    </ConfigProvider>
                </Col>
            </Row>




        </>


    );
}

export default ClientTable;