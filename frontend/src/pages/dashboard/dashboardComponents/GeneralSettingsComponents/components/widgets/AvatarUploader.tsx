import { Upload, message, Avatar } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {uploadAvatar} from "@/app/api";

interface AvatarUploaderProps {
    onImageChange: (file: any) => void;
    avatar: string|null;
}
const AvatarUploader = ({onImageChange , avatar} : AvatarUploaderProps) => {
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (avatar) setAvatarUrl(avatar as any);
    }, []);

    const handleChange = (info:any) => {
        console.log(info);

        if (info.file) {

            console.log('File type:', info.file.type);
            console.log('File content:', info.file.originFileObj);

            const reader:any = new FileReader();
            reader.addEventListener('load', () => {
                onImageChange(info.file.originFileObj);
                console.log('Reader result:', reader.result);
                setAvatarUrl(reader.result);
            });

            const blob = new Blob([info.file.originFileObj], { type: info.file.type });
            reader.readAsDataURL(blob);
        }
    };



    const customRequest = ({ onSuccess }:any) => {

    };

    return (
        <Upload
            customRequest={customRequest}
            showUploadList={false}
            onChange={handleChange}
        >
            <Avatar
                size={64}
                icon={!avatarUrl ? <UserOutlined /> : null}
                src={avatarUrl ? avatarUrl : avatar}
                alt="Avatar"
            />
            <div style={{ marginTop: 8 }}>
                <UploadOutlined />
                <span className={`mx-3`}>
                    {!avatarUrl ? 'Choisir une photo de profil' : "Changer la photo de profil"}

                </span>
            </div>
        </Upload>
    );
};

export default AvatarUploader;
