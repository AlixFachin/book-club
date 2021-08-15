# Japan Book Club (temporary name)
This is the "real" version of the project I wanted to achieve since... forever.

## Summary 🤓
This code contains the code corresponding to a online book sharing club:
* Each user has an inventory of books (physical books)
* Each user can lend books to other users, the system will keep track of this and notify people if necessary
* Users can search other users' public inventories
* Users can chat with other users to agree on a location for the book exchange
* Users can review books and leave a small message
* Site should be bilingual (even though not all the DB content can be translated)

## Tech stack 😵‍💫
* Back-end is with **TypeScript** and **PostgreSQL** database, using **TypeORM** as an intermediary
* Front-end is in **React** with **TypeScript** and **PWA** facilities
* Chat and Authentication is managed by **Firebase**

## Thank you to, references

* [JavaScript in plain English](https://javascript.plainenglish.io/create-a-rest-api-with-express-postgresql-typeorm-and-typescript-ac42a20b66c7) for the TypeORM/Express tutorial
