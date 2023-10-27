<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230922210135 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE prize (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(150) NOT NULL, name VARCHAR(100) NOT NULL, type VARCHAR(100) NOT NULL, prize_value VARCHAR(150) NOT NULL, winning_rate DOUBLE PRECISION NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE store (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, headquarters_address VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, postal_code VARCHAR(255) NOT NULL, city VARCHAR(100) NOT NULL, country VARCHAR(100) NOT NULL, capital NUMERIC(10, 2) NOT NULL, status INT NOT NULL, opening_date DATE DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE store_user (store_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_6F2A7887B092A811 (store_id), INDEX IDX_6F2A7887A76ED395 (user_id), PRIMARY KEY(store_id, user_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ticket (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, prize_id INT DEFAULT NULL, ticket_code VARCHAR(100) NOT NULL, win_date DATETIME DEFAULT NULL, INDEX IDX_97A0ADA3A76ED395 (user_id), INDEX IDX_97A0ADA3BBE43214 (prize_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, role_id INT NOT NULL, lastname VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL, gender VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, date_of_birth DATE NOT NULL, password VARCHAR(255) NOT NULL, api_token VARCHAR(255) DEFAULT NULL, api_token_created_at DATETIME DEFAULT NULL, phone VARCHAR(50) DEFAULT NULL, status INT NOT NULL, INDEX IDX_8D93D649D60322AC (role_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_store (user_id INT NOT NULL, store_id INT NOT NULL, INDEX IDX_1D95A32FA76ED395 (user_id), INDEX IDX_1D95A32FB092A811 (store_id), PRIMARY KEY(user_id, store_id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE store_user ADD CONSTRAINT FK_6F2A7887B092A811 FOREIGN KEY (store_id) REFERENCES store (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE store_user ADD CONSTRAINT FK_6F2A7887A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA3BBE43214 FOREIGN KEY (prize_id) REFERENCES prize (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649D60322AC FOREIGN KEY (role_id) REFERENCES role (id)');
        $this->addSql('ALTER TABLE user_store ADD CONSTRAINT FK_1D95A32FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_store ADD CONSTRAINT FK_1D95A32FB092A811 FOREIGN KEY (store_id) REFERENCES store (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE store_user DROP FOREIGN KEY FK_6F2A7887B092A811');
        $this->addSql('ALTER TABLE store_user DROP FOREIGN KEY FK_6F2A7887A76ED395');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA3A76ED395');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA3BBE43214');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649D60322AC');
        $this->addSql('ALTER TABLE user_store DROP FOREIGN KEY FK_1D95A32FA76ED395');
        $this->addSql('ALTER TABLE user_store DROP FOREIGN KEY FK_1D95A32FB092A811');
        $this->addSql('DROP TABLE prize');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE store');
        $this->addSql('DROP TABLE store_user');
        $this->addSql('DROP TABLE ticket');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_store');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
