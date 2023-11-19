#admin default login
login:
eric.bourdon@gmail.com
mdp:
azerty123456
# Tiptop game project
# Getting Started
## Backend setup

### Symfony
#### Migration and fixtures
Generate data :
1) Generate Roles (ROLE_ADMIN, ROLE_STOREMANAGER, ROLE_EMPLOYEE, ROLE_CLIENT , ROLE_BAILIFF , ROLE_ANONYMOUS)
2) Generate Admin (Eric Bourdon (azerty123456) - super admin)  - Generate Anonyme user
3) Generate Store (TipTop)
4) Generate Prizes (5 prizes)
5) Generate Tickets 
6) Generate Fake Data (Stores, Managers, Employees, Clients , Tickets gain history )
7) Generate Emailing Services (Check the code in src/Command)
8) Generate Emailing Templates variables (Check the code in src/Command)
9) Generate Emailing Templates (Check the code in src/Command)



```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
```

```bash
+ Check generate data commandes in src/Command 


#1 generate roles 
php bin/console app:create-default-role


#2 add tiptop store
php bin/console app:create-default-tiptop-company

#4 generate prizes
php bin/console app:add-prizes

#5 generate tickets
php bin/console app:generate-tickets

#6 generate fake data
php bin/console app:generate-data


#7 generate email services
php bin/console app:generate-email-services

#8 generate email templates variables
php bin/console app:generate-email-templates-variables

#9 generate email templates
php bin/console app:generate-email-templates

```



Next.js
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.





