<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240307193338 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE emailing_history DROP INDEX UNIQ_4E1A8D07ED5CA9E6, ADD INDEX IDX_4E1A8D07ED5CA9E6 (service_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE emailing_history DROP INDEX IDX_4E1A8D07ED5CA9E6, ADD UNIQUE INDEX UNIQ_4E1A8D07ED5CA9E6 (service_id)');
    }
}
