
# Clé de chiffrement (remplacez 'votre_mot_de_passe' par votre propre phrase secrète)
export BORG_PASSPHRASE='F2i2023@grp2'

# Exécute la commande de sauvegarde
/usr/bin/borg create /backup::sauvegarde__$(date +%Y-%m-%d_%H-%M-%S) ~/docker
