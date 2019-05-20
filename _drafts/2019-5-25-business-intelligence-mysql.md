---
layout: post
title: Beginning MySQL for Data Analysts
categories: data
series: On the Job Training for Data Analysts
excerpt:
tags: [mysql, business intelligence, data analytics]
image: data-analytics-series/wood-files-jan-antonin-kolar.jpeg
    feature: 
comments: true
custom_css:
custom_js: 
---
I'm usually writing about hacking, robotics, or machine learning, but I thought I'd start journaling thoughts on data analytics, which is how I'm paying the bills now days.  I wanted to begin with a series on MySQL, as I've some friends I feel it'd help enter the field.  But, I'll eventually expand the series to include visualizations, analysis, and maybe machine learning.  And, ultimately, I hope these articles help anyone who wants to move from manually grinding out reports in Excel to writing queries to automate almost everything.  As I often say, "knowing to code gives you data superpowers!"

I'll state up front, I'm a professional data analyst, but, if I'm confident of anything, it's there are holes in my understanding.  That stated, these articles may contain mistakes.  If you spot one, let me know in the comments and I'll get it fixed quick.

Also, I'm pretty opinionated.  I'm sure these opinions will find their way into my writings.  When notice them, I'll provide a caveat and reasoning for why I hold the opinion.  

One last thing, these articles will focus on **immediately usable techniques**.  I believe I failed my reader if he or she finishes one of my articles and doesn't walk away with a new skill.  I'm not stating I'll skip deep-dives into needed skills, but I believe those are only useful if you have a mental framework on which to hang them.

Ok! Let's do this!

# SQL
When getting started in data analytics Structured Query Language (SQL) is a great place to start.  It is a _well_ established data language, [having been around since the 70s](https://en.wikipedia.org/wiki/SQL).  The intent of SQL is to empower an individual to retrieve data from a database in an efficient and predictable manner.  However, nowadays SQL is used for lots more, such as abstraction, analysis, and semantic changes. 

What does it look like?  Here's a example of a SQL query:
```sql
SELECT *
FROM employees AS e
LEFT JOIN salaries AS s
	ON e.emp_no = s.emp_no
WHERE e.emp_no = 10004;
```
The above code is referred to as a query.  It's a question we'd like to get an answer to, written in a language a machine understands.  In such, running this query should return all the data needed to answer the question.  That's really what SQL's about.  Writing out a question and getting an answer from the database.

Though!  We're not going to go into those details yet.  Right now, let's setup a practice environment where we can learn to *apply* concepts along with the concepts themselves.

# Sooo Many SQLs
I'd love to tell you SQL is simple. It's not, well, at least not to master.  It's complex--every day I learn something new (one reason I enjoy it).  One of its complexities is there are different versions of SQL dialects.  Here, we refer to "dialect" as slightly different ways of coding the same thing.

Some of the most common are:
| Source / Vendor    | Common name (Dialectic)     | 
|--------------------|-----------------| 
| ANSI/ISO Standard  | SQL/PSM         | 
| MariaDB            | SQL/PSM, PL/SQL | 
| Microsoft / Sybase | T-SQL           | 
| MySQL              | SQL/PSM         | 
| Oracle             | PL/SQL          | 
| PostgreSQL         | PL/pgSQL        | 

Let's make it a bit more confusing.  SQL refers to the language, but we often refer to a SQL dialect by it's vendor or source.  Thus, even though MySQL and MariaDB largely speak the same dialect, "SQL / PSM," we refer to them not by their common name, but by the source name.  Thus, "I write MySQL queries."  Or, "At work I use PostgresSQL."

So which one do you focus on?

Well, we have to start somewhere.  I've picked [MySQL](https://www.mysql.com/) because I use it's identical twin, MariaDB, at work.  It's a great SQL dialect to begin with, as it's used by many potential employers.

| Source        | Companies Use | 
|---------------|---------------| 
| MySQL         | 58.7%         | 
| SQL Server    | 41.2%         | 
| PostgreSQL    | 32.9%         | 
| MongoDB       | 25.9%         | 
| SQLite        | 19.7%         | 
| Redis         | 18.0%         | 
| Elasticsearch | 14.1%         | 
*[Source: Stackoverflow 2018 Developer Survey.](https://insights.stackoverflow.com/survey/2018/#technology-_-databases)*

At this point you might be saying, "That's great? I've no idea what any of this means."  No worries! Bookmark this page and come back later.  For now, let's move into setting up a practice MySQL environment.  

* **One last note**, if you're going into a job interview it's a good trick to wait until you hear how they pronounce "SQL" and then say how they do.  As, the "correct" pronunciation is "Ess-cue-ell," however, most professionals I know pronounce it "sequel" (as do I).

![sql-pronunciation](../images/pronounce-sq-camps.png)
https://english.stackexchange.com/a/106957

# Setting up MySQL
These instructions assume you are using Windows.  If not, don't worry, most of them still apply, but you get to skip some steps!  

Ok, were are going to install MySQL Workbench. This program will allow us to write SQL queries, send them to a database, get back and view the results.

## Preparing to Install MySQL Workbench (Windows Only)
If you are using Windows you need to install software MySQL Workbench uses on Windows.

* [Visual C++ Redistributable for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48145)


## MySQL Workbench

* [MySQL Workbench Download](https://dev.mysql.com/downloads/workbench/)



Select your operating system and hit "Download"
![download-mysql-workbench](../images/data-analytics-series/mysql_setup_1.png)


![connecting-to-mysql-server](../images/data-analytics-series/connecting_to_server.gif)

## Downloading MySQL Workbench
Prerequisties:



## Connecting to the Server
## Show / Use Databases
## Tables
## Fields

# Next Article
Server / Desktop
MySQL Program
Databases
Tables
Fields