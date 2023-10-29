#admin default login

login:

eric.bourdon@gmail.com

mdp: 

azerty123456


## Getting Started

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



## Backend setup

symfony
migration and generate default data (admin/storeTipTop/Roles/Tickets/Prizes)
```bash
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load

check generate data commandes in src/Command 

#add tiptop store
php bin/console app:create-default-tiptop-company

# generate roles 
php bin/console app:create-default-role

# generate prizes
php bin/console app:add-prizes

# generate tickets
php bin/console app:generate-tickets
```



