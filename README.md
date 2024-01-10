[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/EoBMzTuA)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13258913&assignment_repo_type=AssignmentRepo)

![](http://143.42.108.232/pvt/Noroff-64.png)
# Noroff
## Back-end Development Year 1
### DAB - Course Assignment RESIT 1

Startup code for Noroff back-end development 1 - DAB course (RESIT 1).

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://143.42.108.232/pvt/important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://143.42.108.232/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---


# Application Installation and Usage Instructions
### Information;
This site is designed for a vehicle rental company. Here registered customers can rent a vehicle of their choosing and the Admin can manage the website by canceleing rentals, edit types or colours and have an overview over vehices ready for service.

### Installation and Instruction:
1. Clone the Repository
2. Install all dependencies using the command "npm install" in your terminal
3. To start the App use the command "npm start" in the terminal


# Environment Variables (.env)
ADMIN_USERNAME = "dabcaowner" 
ADMIN_PASSWORD = "dabca1234" 
DATABASE_NAME = "rentaldb" 
DIALECT = "mysql" 
DIALECTMODEL = "mysql2" 
PORT = "3000" 
HOST = "localhost"

# Additional Libraries/Packages


# NodeJS Version Used
v18.16.0

# DATABASE
To create 'rentaldb' database use this SQL command:

CREATE DATABASE rentaldb;

# DATABASE ACCESS
To create the database access use this SQL command:

CREATE USER 'dabcaowner'@'localhost' IDENTIFIED BY 'dabca1234'; GRANT ALL PRIVILEGES ON rentaldb.* TO 'dabcaowner'@'localhost'; FLUSH PRIVILEGES;

# Licenses
"CarRental.jpg" source: "https://www.vecteezy.com".
