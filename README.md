# So-Pekocko

Sixth project in OpenClassrooms junior webdeveloper course.
This project consists in setting a secure backend API for a gastronomic opinions' application.

The API handles two collections: users (signup and login functions), and sauces (creation, modification, deletion, read all sauces). Within the sauces, a like/dislike system is implemented and allows users to vote for their preferences.

To respect the mission's specifications, the API must be secure, respect OWASP's advice, and ensure personal data protection (european PDGR rules).

## Application 

### 1° Install the frontend 

    - A - First step: Clone this repository

    - B - Then, open a terminal in your editor and get to the frontend folder

    - C - Install all dependencies with npm: 'npm install'

    - D - If you don't have it on your computer, install node-sass: 'npm install node-sass'

    - E - Project has been developed on Angular CLI 7.0.2 - 

    - F - On terminal again, launch development server with 'npm start': you will get to http://localhost:4200

    Application will automatically reload if you modify a source file.
        
### 2° Install the backend 

    - A - Open a terminal in the backend folder

    - B - Install nodemon server (reloads itself unlike node): 'npm install -g nodemon'

    - C - Launch server: 'nodemon serve', starts on port 3000 or if impossible, the terminal will notify which other port is used

### 3° Test the application

    - You can signup; once logged, you can see all sauces added by other users. You can create, modify or delete a new sauce. On each sauce, you can also like or dislike: the counts will automatically adjust themselves.

    - To prevent from brute force attack, the application is set to authorize 5 connections from the same IP adress within the same hour.

    - The password has to be strong: minimum 8 characters and include at least 1 uppercase letter, 1 number, at least 2 digits and no space().