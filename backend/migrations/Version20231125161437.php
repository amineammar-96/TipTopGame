<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231125161437 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action_history ADD store_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE action_history ADD CONSTRAINT FK_FD18F8AAB092A811 FOREIGN KEY (store_id) REFERENCES store (id)');
        $this->addSql('CREATE INDEX IDX_FD18F8AAB092A811 ON action_history (store_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action_history DROP FOREIGN KEY FK_FD18F8AAB092A811');
        $this->addSql('DROP INDEX IDX_FD18F8AAB092A811 ON action_history');
        $this->addSql('ALTER TABLE action_history DROP store_id');
    }
}
