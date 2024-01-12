<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231226142727 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE action_history (id INT AUTO_INCREMENT NOT NULL, user_done_action_id INT NOT NULL, user_action_related_to_id INT DEFAULT NULL, store_id INT DEFAULT NULL, action_type VARCHAR(255) NOT NULL, details LONGTEXT NOT NULL, created_at DATETIME NOT NULL, INDEX IDX_FD18F8AAD50815F5 (user_done_action_id), INDEX IDX_FD18F8AAC5672D2D (user_action_related_to_id), INDEX IDX_FD18F8AAB092A811 (store_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE avatar (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, filename VARCHAR(100) NOT NULL, path VARCHAR(200) NOT NULL, UNIQUE INDEX UNIQ_1677722FA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE badge (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE connection_history (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, login_time DATETIME NOT NULL, logout_time DATETIME DEFAULT NULL, is_active TINYINT(1) NOT NULL, duration VARCHAR(50) DEFAULT NULL, INDEX IDX_5CB09668A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE emailing_history (id INT AUTO_INCREMENT NOT NULL, service_id INT NOT NULL, receiver_id INT NOT NULL, sent_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_4E1A8D07ED5CA9E6 (service_id), INDEX IDX_4E1A8D07CD53EDB6 (receiver_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE loyalty_points (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, points INT NOT NULL, created_at DATETIME NOT NULL, INDEX IDX_E0C7D07DA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_badge (user_id INT NOT NULL, badge_id INT NOT NULL, INDEX IDX_1C32B345A76ED395 (user_id), INDEX IDX_1C32B345F7A2C2FC (badge_id), PRIMARY KEY(user_id, badge_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE action_history ADD CONSTRAINT FK_FD18F8AAD50815F5 FOREIGN KEY (user_done_action_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE action_history ADD CONSTRAINT FK_FD18F8AAC5672D2D FOREIGN KEY (user_action_related_to_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE action_history ADD CONSTRAINT FK_FD18F8AAB092A811 FOREIGN KEY (store_id) REFERENCES store (id)');
        $this->addSql('ALTER TABLE avatar ADD CONSTRAINT FK_1677722FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE connection_history ADD CONSTRAINT FK_5CB09668A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE emailing_history ADD CONSTRAINT FK_4E1A8D07ED5CA9E6 FOREIGN KEY (service_id) REFERENCES email_service (id)');
        $this->addSql('ALTER TABLE emailing_history ADD CONSTRAINT FK_4E1A8D07CD53EDB6 FOREIGN KEY (receiver_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE loyalty_points ADD CONSTRAINT FK_E0C7D07DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_badge ADD CONSTRAINT FK_1C32B345A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_badge ADD CONSTRAINT FK_1C32B345F7A2C2FC FOREIGN KEY (badge_id) REFERENCES badge (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action_history DROP FOREIGN KEY FK_FD18F8AAD50815F5');
        $this->addSql('ALTER TABLE action_history DROP FOREIGN KEY FK_FD18F8AAC5672D2D');
        $this->addSql('ALTER TABLE action_history DROP FOREIGN KEY FK_FD18F8AAB092A811');
        $this->addSql('ALTER TABLE avatar DROP FOREIGN KEY FK_1677722FA76ED395');
        $this->addSql('ALTER TABLE connection_history DROP FOREIGN KEY FK_5CB09668A76ED395');
        $this->addSql('ALTER TABLE emailing_history DROP FOREIGN KEY FK_4E1A8D07ED5CA9E6');
        $this->addSql('ALTER TABLE emailing_history DROP FOREIGN KEY FK_4E1A8D07CD53EDB6');
        $this->addSql('ALTER TABLE loyalty_points DROP FOREIGN KEY FK_E0C7D07DA76ED395');
        $this->addSql('ALTER TABLE user_badge DROP FOREIGN KEY FK_1C32B345A76ED395');
        $this->addSql('ALTER TABLE user_badge DROP FOREIGN KEY FK_1C32B345F7A2C2FC');
        $this->addSql('DROP TABLE action_history');
        $this->addSql('DROP TABLE avatar');
        $this->addSql('DROP TABLE badge');
        $this->addSql('DROP TABLE connection_history');
        $this->addSql('DROP TABLE emailing_history');
        $this->addSql('DROP TABLE loyalty_points');
        $this->addSql('DROP TABLE user_badge');
    }
}
