<?php

namespace App\Entity;

use App\Repository\TicketRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TicketRepository::class)]
class Ticket
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $ticket_code = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $win_date = null;

    #[ORM\ManyToOne(inversedBy: 'tickets')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'tickets')]
    private ?Prize $prize = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTicketCode(): ?string
    {
        return $this->ticket_code;
    }

    public function setTicketCode(string $ticket_code): static
    {
        $this->ticket_code = $ticket_code;

        return $this;
    }

    public function getWinDate(): ?\DateTimeInterface
    {
        return $this->win_date;
    }

    public function setWinDate(?\DateTimeInterface $win_date): static
    {
        $this->win_date = $win_date;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getPrize(): ?Prize
    {
        return $this->prize;
    }

    public function setPrize(?Prize $prize): static
    {
        $this->prize = $prize;

        return $this;
    }
}
