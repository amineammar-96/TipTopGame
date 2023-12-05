<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231126003900 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE emailing_history (id INT AUTO_INCREMENT NOT NULL, service_id INT NOT NULL, receiver_id INT NOT NULL, sent_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_4E1A8D07ED5CA9E6 (service_id), INDEX IDX_4E1A8D07CD53EDB6 (receiver_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE emailing_history ADD CONSTRAINT FK_4E1A8D07ED5CA9E6 FOREIGN KEY (service_id) REFERENCES email_service (id)');
        $this->addSql('ALTER TABLE emailing_history ADD CONSTRAINT FK_4E1A8D07CD53EDB6 FOREIGN KEY (receiver_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE emailing_history DROP FOREIGN KEY FK_4E1A8D07ED5CA9E6');
        $this->addSql('ALTER TABLE emailing_history DROP FOREIGN KEY FK_4E1A8D07CD53EDB6');
        $this->addSql('DROP TABLE emailing_history');
    }
}
