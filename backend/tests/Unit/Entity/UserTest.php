<?php


namespace App\Tests\Unit\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function testGetFullName()
    {
        $user = new User();
        $user->setFirstName('John');
        $user->setLastName('Doe');

        $this->assertEquals('John Doe', $user->getFullName());
    }


    public function testGetFirstName()
    {
        $user = new User();
        $user->setFirstName('John');
        $this->assertEquals('John', $user->getFirstName());
    }

    public function testGetLastName()
    {
        $user = new User();
        $user->setLastName('Doe');
        $this->assertEquals('Doe', $user->getLastName());
    }

    public function testGetEmail()
    {
        $user = new User();
        $user->setEmail('test@test.com');
        $this->assertEquals('test@test.com', $user->getEmail());
    }




}
