---
layout: post
title: Setup Local MySQL Database
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
* [Max](https://ladvien.com/data-analytics-mysql-localhost-setup/#mac)

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
