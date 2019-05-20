---
layout: post
title: Beginning MySQL for Data Analysts
categories: data
series: On the Job Training for Data Analysts
excerpt:
tags: [mysql, business intelligence, data analytics]
image: 
    feature: 
comments: true
custom_css:
custom_js: 
---
I'm usually writing about hacking, robotics, or machine learning, but I thought I'd start journaling thoughts on data analytics, which is how I'm paying the bills now days.

I wanted to begin with a series on MySQL, as I've some friends I feel it'd help enter the field.  But, I'll eventually expand the series to include visualizations, analysis, and maybe machine learning algorithms.

I'll state up front, I'm not the best data analyst (of course, I'm not the worst either--I think), therefore, these articles may contain mistakes.  If you spot one, let me know in the comments and I'll get it fixed quick.

Also, I'm pretty opinionated.  I'm sure these opinions will find their way into my writings.  When I'm aware of them, I'll provide a caveat and reasoning for why I hold the opinion.  

One last thing, these articles will focus on **immediately usable techniques**.  I feel I'll have failed if you finish one of my articles and don't know how to immediately use what you've read.  It's not that I'll skip over deep-dives into needed skills, but I believe those are only useful if you have a mental framework on which to hang the results of a deep-dive.

Ok! Let's do this!

# SQL
When getting started in data analytics Structured Query Language (SQL) is a great place to start.  It is a _well_ established data language, [having been around since the 70s](https://en.wikipedia.org/wiki/SQL).  The intent of SQL is to empower an individual to retrieve data from a database in a predictable manner.  However, nowadays SQL is used for lots more, such as abstraction, analysis, and semantic changes. 


What does it look like?  Here's a example of a SQL query:
```sql
SELECT *
FROM employees AS e
LEFT JOIN salaries AS s
	ON e.emp_no = s.emp_no
WHERE e.emp_no = 10004;
```
The above code is referred to as a query?  That is, a question we'd like to get an answer(s) from the database.  Executing this query would possibly return all the data needed to answer the question.

That's really what SQL's about.  Writing out a question and getting an answer from the database.

Though!  We're not going to go into those details yet.  Right now, let's setup a practice environment where we can learn to *apply* concepts along with the concepts themselves.

# MySQL
I'd love to tell you SQL is simple. It's not, well, at least not to master.  It's complex--every day I learn something new (one reason I enjoy it).  One of its complexities is there are different versions of SQL dialects.

Some of the most common are:
| Source / Vendor    | Common name     | 
|--------------------|-----------------| 
| ANSI/ISO Standard  | SQL/PSM         | 
| MariaDB            | SQL/PSM, PL/SQL | 
| Microsoft / Sybase | T-SQL           | 
| MySQL              | SQL/PSM         | 
| Oracle             | PL/SQL          | 
| PostgreSQL         | PL/pgSQL        | 

Let's make it a bit more confusing.  SQL refers to the language, but we often refer to a SQL dialect by it's vendor or source.

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

Ok, that should get you a rough idea of the marketibility of having some MySQL skills.  At this point you might be saying, "That's great? I've no idea what any of this means."  No worries! Bookmark this page and come back later.  For now, let's move into setting up a practice MySQL environment.  

* **Note, if you're going into a job interview it's a good trick to wait until you hear how they pronounce "SQL."  As, the "correct" pronunciation is "Ess-cue-ell", however, most professionals I know pronounce it "sequel" (as do I).**

![sql-pronunciation](../images/pronounce-sq-camps.png)
https://english.stackexchange.com/a/106957

# MySQL
Server / Desktop
MySQL Program
Databases
Tables
Fields
![connecting-to-mysql-server](../images/data-analytics-series/connecting_to_server.gif)

## Downloading MySQL Workbench
Prerequisties:
https://www.microsoft.com/en-us/download/details.aspx?id=30653
https://www.microsoft.com/en-us/download/details.aspx?id=48145

MySQL Workbench
https://dev.mysql.com/downloads/workbench/

## Connecting to the Server
## Show / Use Databases
## Tables
## Fields