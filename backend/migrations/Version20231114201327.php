<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231114201327 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE ticket_history (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, employee_id INT DEFAULT NULL, ticket_id INT NOT NULL, status VARCHAR(255) NOT NULL, INDEX IDX_2B762919A76ED395 (user_id), INDEX IDX_2B7629198C03F15C (employee_id), INDEX IDX_2B762919700047D2 (ticket_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE ticket_history ADD CONSTRAINT FK_2B762919A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE ticket_history ADD CONSTRAINT FK_2B7629198C03F15C FOREIGN KEY (employee_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE ticket_history ADD CONSTRAINT FK_2B762919700047D2 FOREIGN KEY (ticket_id) REFERENCES ticket (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ticket_history DROP FOREIGN KEY FK_2B762919A76ED395');
        $this->addSql('ALTER TABLE ticket_history DROP FOREIGN KEY FK_2B7629198C03F15C');
        $this->addSql('ALTER TABLE ticket_history DROP FOREIGN KEY FK_2B762919700047D2');
        $this->addSql('DROP TABLE ticket_history');
    }
}
