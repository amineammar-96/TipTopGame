<?php

namespace App\Entity;

use App\Repository\UserRepository;
use App\Validator\Constraints\UniqueEmail;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\SerializedName;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    const STATUS_OPEN = 1;
    const STATUS_CLOSED = 2;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $lastname = null;

    #[ORM\Column(length: 255, nullable: false)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    private ?string $gender = null;

    #[ORM\Column(length: 255, unique: false)]
    #[UniqueEmail]
    private ?string $email = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date_of_birth = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Role $role = null;


    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Ticket::class)]
    private Collection $tickets;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $api_token = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $api_token_created_at = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column]
    private ?int $status = null;

    #[ORM\ManyToMany(targetEntity: Store::class)]
    private Collection $stores;

    public function __construct()
    {
        $this->tickets = new ArrayCollection();
        $this->stores = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getDateOfBirth(): ?\DateTimeInterface
    {
        return $this->date_of_birth;
    }

    public function setDateOfBirth(\DateTimeInterface $date_of_birth): static
    {
        $this->date_of_birth = $date_of_birth;

        return $this;
    }

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(?Role $role): static
    {
        $this->role = $role;

        return $this;
    }


    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return Collection<int, Ticket>
     */
    public function getTickets(): Collection
    {
        return $this->tickets;
    }

    public function addTicket(Ticket $ticket): static
    {
        if (!$this->tickets->contains($ticket)) {
            $this->tickets->add($ticket);
            $ticket->setUser($this);
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): static
    {
        if ($this->tickets->removeElement($ticket)) {
            // set the owning side to null (unless already changed)
            if ($ticket->getUser() === $this) {
                $ticket->setUser(null);
            }
        }

        return $this;
    }

    public function getApiToken(): ?string
    {
        return $this->api_token;
    }

    public function setApiToken(?string $api_token): static
    {
        $this->api_token = $api_token;

        return $this;
    }

    public function getApiTokenCreatedAt(): ?\DateTimeInterface
    {
        return $this->api_token_created_at;
    }

    public function setApiTokenCreatedAt(?\DateTimeInterface $api_token_created_at): static
    {
        $this->api_token_created_at = $api_token_created_at;

        return $this;
    }


    public function getSalt()
    {
        // Since we are using bcrypt, there is no need for a separate salt.
        // However, the method is required by the UserInterface, so just return null.
        return null;
    }

    public function getUsername()
    {
        // Return the unique identifier for the user (e.g., email).
        return $this->email;
    }

    public function eraseCredentials()
    {
        // If you have any sensitive data in your entity that should be removed after authentication,
        // you can handle it here. For most cases, you can leave it empty.
    }

    // Implement the new getUserIdentifier() method
    public function getUserIdentifier(): string
    {
        return $this->email; // Return the unique user identifier, typically the email.
    }


    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = [];
        if (isset($this->role)) {
            $roles[] = $this->role->getName();
        }
        return $roles;
    }

    /**
     * Get the user stores formatted as JSON objects.
     *
     * @return array
     * @SerializedName("userStores")
     */
    public function getUserStoresJson(): array
    {
        $stores = [];
        foreach ($this->stores as $store) {
            $storeValue = $store->getStoreJson();
            $storeAux = [
                $storeValue,
            ];
            $stores[] = $storeAux;
        }
        return $stores;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): static
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return Collection<int, Store>
     */
    public function getStores(): Collection
    {
        return $this->stores;
    }

    public function addStore(Store $store): static
    {
        if (!$this->stores->contains($store)) {
            $this->stores->add($store);
        }

        return $this;
    }

    public function removeStore(Store $store): static
    {
        $this->stores->removeElement($store);

        return $this;
    }


    /**
     * Convert the Store object to an associative array for JSON serialization.
     *
     * @return array
     */
    public function getUserJson(): array
    {
        return [
            'id' => $this->getId(),
            'lastname' => $this->getLastname(),
            'firstname' => $this->getFirstname(),
            'phone' => $this->getPhone(),
            'email' => $this->getEmail(),
            'status' => $this->getStatus(),
            'role' => $this->getRole()->getName(),
            'stores' => $this->getUserStoresJson(),
            'dateOfBirth' => $this->getDateOfBirth()->format('d/m/Y'),
            'age' => $this->getAge(),
            'gender' => $this->getGender(),
        ];
    }

    private function getAge(): int
    {
        $now = new \DateTime();
        $interval = $this->getDateOfBirth()->diff($now);
        return $interval->y;
    }
}
