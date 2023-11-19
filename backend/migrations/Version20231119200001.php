<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231119200001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE avatar (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, filename VARCHAR(100) NOT NULL, path VARCHAR(200) NOT NULL, UNIQUE INDEX UNIQ_1677722FA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE avatar ADD CONSTRAINT FK_1677722FA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_personal_info DROP phone');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE avatar DROP FOREIGN KEY FK_1677722FA76ED395');
        $this->addSql('DROP TABLE avatar');
        $this->addSql('ALTER TABLE user_personal_info ADD phone VARCHAR(255) DEFAULT NULL');
    }
}
