<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231029095443 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ticket ADD store_id INT DEFAULT NULL, ADD employee_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA3B092A811 FOREIGN KEY (store_id) REFERENCES store (id)');
        $this->addSql('ALTER TABLE ticket ADD CONSTRAINT FK_97A0ADA38C03F15C FOREIGN KEY (employee_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_97A0ADA3B092A811 ON ticket (store_id)');
        $this->addSql('CREATE INDEX IDX_97A0ADA38C03F15C ON ticket (employee_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA3B092A811');
        $this->addSql('ALTER TABLE ticket DROP FOREIGN KEY FK_97A0ADA38C03F15C');
        $this->addSql('DROP INDEX IDX_97A0ADA3B092A811 ON ticket');
        $this->addSql('DROP INDEX IDX_97A0ADA38C03F15C ON ticket');
        $this->addSql('ALTER TABLE ticket DROP store_id, DROP employee_id');
    }
}
