---
layout: post
title: Setup a Local MySQL Database
categories: data
series: On the Job Training for Data Analysts
excerpt:
tags: [mysql, business intelligence, data analytics]
image: 
    feature: data-analytics-series/wood-files-jan-antonin-kolar.jpeg
comments: true
custom_css:
custom_js: 
---

The last two articles have been getting oriented to SQL, however, the information in them will disappear quickly if we don't give you a way to practice on data meaningful to you.  Let's face it, as much fun as it is to find out random employees salaries, those don't mean anything to _you_.  

This article will show you how to setup a copy of MySQL Server on your PC, connect to it, load data from a CSV, and query those data.  There's a lot to get done, so let's get started.

# Local MySQL Server Setup
Each of the three operating systems are a little different on how you must go about setting up a local copy of MySQL Server.  Unfortunately, Windows is the most complex.  Anyway, feel free to skip to the appropriate section

* [Windows](https://ladvien.com/data-analytics-mysql-localhost-setup/#windows)
* [Mac](https://ladvien.com/data-analytics-mysql-localhost-setup/#mac)

## Windows
First, download the MySQL MSI Installer.

* [MySQL Server Windows Installer](https://dev.mysql.com/downloads/installer/)

![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_43.PNG)

After you've downloaded it, open the the file.

![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_44.PNG)

If you are prompted to "Upgrade" go ahead and say "Yes"

![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_45.PNG)

The installer is a bit confusing, but don't worry, most everything is fine left on its default.

Click on MySQL Server then the Add button.  Add "MySQL Server" and "Connector/OBDC x64."  Then click "Next."  You will see a Installation summary, click on "Execute" and wait for the download to finish and then install wizard to begin.

As I stated, most of the install wizard questions we will leave as default.

![mysql-windows-installer-download](../images/data-analytics-series/mysql-server-install.gif)

![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_46.PNG)

![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_47.PNG)

![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_48.PNG)

On the "Accounts and Roles" section you will need to decide on your password for the SQL Server on your local PC.  I obviously didn't pick a great one.  MySQL Server will automatically setup a user with the name of `root` and a password you set here.  This `root` user will permissions to do anything to the server.

![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_49.PNG)

![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_50.PNG)

Execute the installer and let it finish.
![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_51.PNG)

Once it finishes you should now have MySQL Server installed on your local PC. Skip to the last section to test it out.

## Mac
Mac's a bit simpler.

* [MySQL Server Mac Installer](https://dev.mysql.com/downloads/mysql/)

Download the `.dmg` installer.
![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_56.PNG)

Click on "No thanks, just start my download" and when the download is finished, double click on it.
![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_57.PNG)

Double click on the installer.  You will need to enter your system password for the installer to setup MySQL Server, but you will also need to provide the MySQL Server `root` user a password.  Don't consfuse the two, unless you plan for them to be the same.

![mysql-windows-installer-download](../images/data-analytics-series/mysql-server-install-mac.gif)

Once it finishes you should now have MySQL Server installed on your Mac. Skip to the last section to test it out.

# Testing your Local SQL Server
Go ahead and open MySQL Workbench and let's connect to this new local server.

Click on the "New Connection" icon and leave everything default, except the "Connection Name," here enter `localhost`.
![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_52.PNG)

Double click on the new connection and enter the password you created during installation.  *Voila!*

Let's run a command to make sure everything is working.
```sql
SHOW databases;
```
You should see:
![mysql-windows-installer-download](../images/data-analytics-series/mysql_setup_53.PNG)

# Loading CSV

Create a database
```sql
CREATE DATABASE name_of_your_database;
```
Before we create a table, make sure we are using the created datebase.
```sql
USE name_of_your_database
```
Now, we need to go over a bit of boring stuff before we get to loading the CSV.  Sorry, I'll try to keep it brief.

## Datatypes
![xkcd-types](../images/data-analytics-series/types.png){: .float-right}

In SQL, every field has something called a "datatype."  You can think of a datatype as a tag on your data tell the computer how to read them.

Ultimately, a computer can't make sense of any human-words.  It has to convert everything into `0` and `1` before it understand its.  Think of a datatype is telling the computer "That word is in French and this other word is English."  Then, the computer knows how to translate those correctly.

If this was left up to the computer entirely, it might see a word and say, "Oh, yah, this is one of those French words," when it is actually English, thus, the conversion to `0` and `1`s are incorrect.

<div style="clear: both;"></div>

You may have encountered this in a spreadsheet.  If you open a spreadsheet and see something like
![xkcd-types](../images/data-analytics-series/mysql_setup_59.png)

The data I actually provided the spreadsheet were:

| Zipcode |
|:--------|
| 75444   |
| 06579   |

Notice the zero in front of `6579`, this was due to the computer saying, "Oh, these data look like numbers--and since the human didn't tell me otherwise, I'm going to treat them like numbers.  And, well, it is perfectly valid to drop the leading zero of a number."

In short, datatypes are _extremely_ important.  In my own work, a good 10-20% of bugs I find are when a human has provided an incorrect datatype to a computer.

### SQL Datatypes
In SQL there are a lot of datatypes, however, some you may never need to use.  One way SQL is a bit different than a spreadsheet is it wants to know ahead of time the size it needs to make the field.

For example:
* CHAR(19) could hold the following: `<-------19-------->` 
* CHAR(5) could hold the following: `<-5->`

The maximum size of the data a human will try to stuff in the field is important to the SQL program, as it tries to store data in such a way it minimizes space used and maximizes efficiency in retrieving the data.

As for the different types of data, not all of them will require you specify the size, but all datatypes will have a size.  Some of them, though, SQL can figure out on its own.

Ok, here are the types you will most commonly be using:

#### `CHAR`
The `CHAR` is short for character data.  These data will include, you guessed it, characters.  Examples are: `A`, `B`, `z`, `$`, `:`, etc.  They are a single symbol understood by humans.

#### `VARCHAR`


* `VARCHAR`
* `TINYINT` or `INT`
* `TEXT`

## Creating the Table

```sql
CREATE TABLE IF NOT EXISTS tasks (
    task_id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    start_date DATE,
    due_date DATE,
    status TINYINT NOT NULL,
    priority TINYINT NOT NULL,
    description TEXT,
    PRIMARY KEY (task_id)
)  ENGINE=INNODB;
```