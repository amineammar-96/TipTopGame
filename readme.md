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

### Reset game and generate all data in one command 

-- This command will purge all tables and generate all data from scratch

-- data generated Tables:
+ role
+ prize
+ user
+ avatar
+ store
+ user_store
+ user_personal_info
+ loyalty_points
+ badge
+ user_badge
+ ticket_history
+ connection_history
+ emailing_history
+ action_history
+ email_service
+ email_template
+ email_template_variable

-- data generated :
+ 6 roles (ROLE_ADMIN, ROLE_STOREMANAGER, ROLE_EMPLOYEE, ROLE_CLIENT , ROLE_BAILIFF , ROLE_ANONYMOUS)


+ 1 default store TipTop company
  + +1 Admin Eric Bourdon
    +  email : eric.bourdon@gmail.com
    +  mdp : azerty123456
  + +1 Anonymous user - For the user's history -We will use this user when a client delete or deactivate his account


+ 5 prizes 
  + Infuser
  + Tea Box (100g) 
  + Signature Tea Box (100g) 
  + Discovery box (Value: 39€)
  + Discovery box (Value: 69€)

+ 5 Badges
    + Explorateur des Saveurs - Niveau 1
    + Maître Infuseur - Niveau 2
    + Collectionneur de Thé - Niveau 3
    + Gourmet du Thé - Niveau 4
    + Grand Maître du Thé - Niveau 5

+ Tickets codes generated for the wheel of fortune 
  + ***Customize the number of tickets wanted in src/Command/GenerateTicketsCommand.php***
  + by default 1000 tickets will be generated

+ Fake data generated
    + 5 stores
    + 20 managers (store managers)
    + 40 employees (caissiers)
    + 100 clients
    + 400 tickets history




#### **- This may take a long time just wait for the end of the process please 😀**

```bash
php bin/console doctrine:migrations:migrate
php bin/console app:reset-game # reinitialize all data from scratch
```

## Output
```bash
Default roles created successfully.
Default company created successfully.
Prizes created successfully.
Badges generated successfully.
Tickets generated successfully.
Email Services generated successfully.
Email Templates Variables generated successfully.
Email Templates generated successfully.
Data generated successfully.
Game reset successfully.
```


# or

Generate data :
1) Generate Roles (ROLE_ADMIN, ROLE_STOREMANAGER, ROLE_EMPLOYEE, ROLE_CLIENT , ROLE_BAILIFF , ROLE_ANONYMOUS)
2) Generate Store (TipTop) &&  Admin (Eric Bourdon (azerty123456) - super admin)  - Generate Anonyme user
3) Generate Prizes (5 prizes)
4) Generate Tickets 
5) Generate Fake Data (Stores, Managers, Employees, Clients , Tickets gain history )
6) Generate Emailing Services (Check the code in src/Command)
7) Generate Emailing Templates variables (Check the code in src/Command)
8) Generate Emailing Templates (Check the code in src/Command)



```bash
php bin/console doctrine:migrations:migrate
```

```bash
+ Check generate data commandes in src/Command 


#1 generate roles 
php bin/console app:create-default-role

#2 add tiptop store , admin and anonyme user 
php bin/console app:create-default-tiptop-company

#3 generate prizes
php bin/console app:add-prizes

#4 generate tickets
php bin/console app:generate-tickets

#5 generate fake data
php bin/console app:generate-data

#6 generate email services
php bin/console app:generate-email-services

#7 generate email templates variables
php bin/console app:generate-email-templates-variables

#8 generate email templates
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





