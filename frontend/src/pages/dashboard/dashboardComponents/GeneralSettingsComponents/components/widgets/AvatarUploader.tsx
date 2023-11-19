import { Upload, message, Avatar } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const AvatarUploader = () => {
    const [avatarUrl, setAvatarUrl] = useState(null);

    const handleChange = (info:any) => {

    };

    const customRequest = ({ onSuccess }:any) => {
        // Simulate an upload request (replace this with your actual upload logic)
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };

    return (
        <Upload
            customRequest={customRequest}
            showUploadList={false}
            onChange={handleChange}
            beforeUpload={(file) => false} // Prevent automatic upload to handle customRequest
        >
            <Avatar
                size={64}
                icon={!avatarUrl ? <UserOutlined /> : null}
                src={avatarUrl}
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
