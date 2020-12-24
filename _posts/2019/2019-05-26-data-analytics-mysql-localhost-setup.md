---
layout: post
title: Setup a Local MySQL Database
categories: data
series: On the Job Training for Data Analysts
excerpt:
tags: [mysql, business intelligence, data analytics]
image: 
    feature: data-analytics-series/wood-files-jan-antonin-kolar.png
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

![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_43.PNG)

After you've downloaded it, open the the file.

![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_44.PNG)

If you are prompted to "Upgrade" go ahead and say "Yes"

![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_45.PNG)

The installer is a bit confusing, but don't worry, most everything is fine left on its default.

Click on MySQL Server then the Add button.  Add "MySQL Server" and "Connector/OBDC x64."  Then click "Next."  You will see a Installation summary, click on "Execute" and wait for the download to finish and then install wizard to begin.

As I stated, most of the install wizard questions we will leave as default.

<video class="post-video" autoplay loop muted playsinline>
  <source src="https://ladvien.com/images/movies/mysql-server-install.mp4" 
  title="Installing the MySQL server"
  type="video/mp4">
</video>


![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_46.PNG)

![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_47.PNG)

![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_48.PNG)

On the "Accounts and Roles" section you will need to decide on your password for the SQL Server on your local PC.  I obviously didn't pick a great one.  MySQL Server will automatically setup a user with the name of `root` and a password you set here.  This `root` user will permissions to do anything to the server.

![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_49.PNG)

![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_50.PNG)

Execute the installer and let it finish.
![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_51.PNG)

Once it finishes you should now have MySQL Server installed on your local PC. Skip to the last section to test it out.

## Mac
Mac's a bit simpler.

* [MySQL Server Mac Installer](https://dev.mysql.com/downloads/mysql/)

Download the `.dmg` installer.
![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_56.PNG)

Click on "No thanks, just start my download" and when the download is finished, double click on it.
![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_57.PNG)

Double click on the installer.  You will need to enter your system password for the installer to setup MySQL Server, but you will also need to provide the MySQL Server `root` user a password.  Don't consfuse the two, unless you plan for them to be the same.

<video class="post-video" autoplay loop muted playsinline>
  <source src="https://ladvien.com/images/movies/mysql-server-install-mac.mp4" 
  title="Downloading the MySQL Window's installer."
  type="video/mp4">
</video>

Once it finishes you should now have MySQL Server installed on your Mac. Skip to the last section to test it out.

# Testing your Local SQL Server
Go ahead and open MySQL Workbench and let's connect to this new local server.

Click on the "New Connection" icon and leave everything default, except the "Connection Name," here enter `localhost`.
![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_52.PNG)

Double click on the new connection and enter the password you created during installation.  *Voila!*

Let's run a command to make sure everything is working.
```sql
SHOW databases;
```
You should see:
![mysql-windows-installer-download](/images/data-analytics-series/mysql_setup_53.PNG)

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
In SQL, every field has something called a "datatype."  You can think of a datatype as a tag on your data tell the computer how to read them.

Ultimately, a computer can't make sense of any human-words.  It has to convert everything into `0` and `1` before it understand its.  If this conversion was left up to the computer entirely, it might see a word and say, "Oh, yah, this is one of those French words," when it is actually English, thus, the conversion to `0` and `1`s are incorrect.

You may have encountered this in a spreadsheet.  If you open a spreadsheet and see something like

![xkcd-types](/images/data-analytics-series/mysql_setup_59.png)

The data I actually provided the spreadsheet were:

| Zipcode |
|:--------|
| 75444   |
| 06579   |

Notice the zero in front of `6579`, this was due to the computer saying, "Oh, these data look like numbers--and since the human didn't tell me otherwise, I'm going to treat them like numbers.  And, well, it is perfectly valid to drop the leading zero of a number."

I wish all datatypes were this simple, however, the above example is about is simple as it gets. We can try to skip over a lot of nuances of datatypes and focus on the three we will probably see the most:

* DATE
* TIME
* INT (short of integer)
* FLOAT
* CHAR (short for character)

Here are what samples of the above data would look like in a spreadsheet:

| DATE       | TIME | INT | FLOAT | CHAR | 
|:-----------|:-----|:----|:------|:-----|
| 2019-10-01 | 2019-10-01 12:01:22 | 42 | 42.4 | The answer to it all. | 

#### DATE
Dates are pretty straightforward, they store a year, month, and day as a number.  However, when we retrieve this number it is put in the human readable format listed above.

#### TIME
Time is exactly like `DATE`, but it also includes hours, minutes, and seconds (sometimes milliseconds).

#### INT
An `INT` stores a number no bigger than `2,147,483,647`.  However, one thing an `INT` cannot do is store a partial numbers.  For example, if we try to store `0.5` in an `INT` field it will probably get converted to `1`.

#### FLOAT
`FLOAT`s fill in where `INTS` fail.  That is, a `FLOAT` store only up to the precision you specifiy.  For example, if we tried to store a `0.5` in a `FLOAT` with two precision points we'd be fine.  However, if we tried to store `0.4567` in a `FLOAT` with only two precision points, then it would be converted to `0.46`, or rounded up.

#### CHAR
`CHAR` is meant to store human readable text.  When you put data into a `CHAR` field, the SQL program knows this is human readable information and doesn't try to figure it out at all.  It leaves it literally as it is.  This is why `CHARS` are known as "literals."  They are also called "strings," because the computer seems them as a bunch of characters strung together.

### SQL Datatypes
In SQL there are a lot of datatypes, however, some you may never need to use.  One way SQL is a bit different than a spreadsheet is it wants to know ahead of time the size it needs to make the field.

#### CHAR Revisited
This will mainly impact us when dealing with `CHAR`.  When the SQL program creates a `CHAR` field it wants to know the maximum number of characters which will ever go into the field.

For example:
* CHAR(19) could hold the following: `<-------19-------->` 
* CHAR(5) could hold the following: `<-5->`

One important note, if you put a single character in a `CHAR(5)` field, then the SQL program will fill in the other four characters with a `NULL`.  In short, a `CHAR` field will _always_ be full.

#### VARCHAR
There is another type of character field which allows you to put more or less data than was decided at the beginning.  The `VARCHAR` datatype stands for "variable character" field.  It will allow you to store up to `65,535` characters on MySQL.  This is around 3 pages of text. 

#### VARCHAR vs. CHAR
Why have `CHAR` at all?  Shouldn't we always use `VARCHAR` for everything just in case?  Well, usually, but not always.

Often, when you design a database you want to make it as efficient as possible (I mean, it's going to be successful business product, right?).  The maximum size of the data a human will try to stuff in the field is important to the SQL program, as it tries to store data in such a way it minimizes space used and maximizes efficiency in retrieving the data.

In short, `CHAR` has a few advantages for your database.  And take Social Security Numbers, if your database has to store these data then it should probably be a `CHAR` as these data have historically been 9 characters (11 if you include dashes).

Pop quiz, why don't we store a Social Security Number as an `INT`? 

## Creating the Table
Ok, I've put you through a crash course of datatypes to get you to this point.  

We are going to:
1. Create a database called `tasksDB`
2. Active `tasksDB`
3. Create a table on `tasksDB`, setting the fields datatype
4. Then import a CSV into this table
5. Lastly, we will write a query against the table

Ready!? Let's do it!

### Creating Database
Open Workbench, type, and run the following:
```
CREATE DATABASE tasksDB;

SHOW databases;

USE tasksDB;

SELECT * FROM tasks;

LOAD DATA INFILE './task.csv'  INTO TABLE tasks
FIELDS TERMINATED BY ','
ENCLOSED BY '"' 
LINES TERMINATED BY '\n';

SELECT * FROM tasks;

```


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


https://superuser.com/questions/1354368/mysql-error-in-loading-csv-file-data-into-table