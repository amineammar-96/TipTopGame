<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231125125538 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE action_history (id INT AUTO_INCREMENT NOT NULL, user_done_action_id INT NOT NULL, user_action_related_to_id INT DEFAULT NULL, action_type VARCHAR(255) NOT NULL, details LONGTEXT NOT NULL, created_at DATETIME NOT NULL, INDEX IDX_FD18F8AAD50815F5 (user_done_action_id), INDEX IDX_FD18F8AAC5672D2D (user_action_related_to_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE action_history ADD CONSTRAINT FK_FD18F8AAD50815F5 FOREIGN KEY (user_done_action_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE action_history ADD CONSTRAINT FK_FD18F8AAC5672D2D FOREIGN KEY (user_action_related_to_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action_history DROP FOREIGN KEY FK_FD18F8AAD50815F5');
        $this->addSql('ALTER TABLE action_history DROP FOREIGN KEY FK_FD18F8AAC5672D2D');
        $this->addSql('DROP TABLE action_history');
    }
}
