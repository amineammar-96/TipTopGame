"use client";

import React, { useState } from 'react';
import { Button, Modal } from 'antd';

export default function CookiesModalComponent() {
  const [isModalOpen, setIsModalOpen] = useState(true);


  const handleAccept = () => {
    // Logique d'acceptation des cookies ici
    setIsModalOpen(false);
  };

  const handleRefuse = () => {
    // Logique de refus des cookies ici
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="🍪 Notification relative à l'utilisation des cookies"
        open={isModalOpen}
        onCancel={handleRefuse}
        maskClosable={false}
        footer={[
          <Button className='refuse-button' key="refuse" onClick={handleRefuse}>
            Refuser
          </Button>,
          <Button key="accept" type="primary" onClick={handleAccept}>
            Accepter
          </Button>,
        ]}
        style={{ top: 'auto', left: 20, bottom: 0, right: 'auto', position: 'fixed' }}
      >
        <p>Nous souhaitons vous informer que notre site web utilise des cookies pour améliorer votre expérience en ligne. Ces petits fichiers texte sont stockés sur votre appareil afin d'optimiser la navigation, personnaliser le contenu, et analyser l'utilisation du site.</p>
        
        <p>En acceptant l'utilisation des cookies, vous consentez à ce que nous puissions les utiliser conformément à notre politique de confidentialité et de cookies.</p>
        <p>Merci de faire partie de notre communauté en ligne. Pour plus d'informations, veuillez consulter notre page de politique de confidentialité et de cookies.</p>
      </Modal>
    </>
  );
};
