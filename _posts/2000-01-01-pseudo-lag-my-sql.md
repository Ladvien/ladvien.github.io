---
layout: post
title: Lag and Lead before MySQL 10.2
categories: MySQL
tags: [mysql, lag, lead, dates]
color: "#152a55"
image: 
  feature: pseudo-lag-mysql.png
  teaser: 
  thumb:
comments: true
---

I've recently found myself in the situation where I was required to work with MySQL 10.0.  I was surprised to find MySQL 10.2 and less does not support some common [Windowing Functions](https://drill.apache.org/docs/sql-window-functions-introduction/), specifically, [Value Functions](https://drill.apache.org/docs/value-window-functions/) and [Rank Functions](https://drill.apache.org/docs/ranking-window-functions/).

Well, bummer.  I really needed them.

On top of it, I only had read access to the database without the ability to create a stored procedure.  

Poop.

Somewhat out of desperation, I found myself researching the possibility of creating my own functions using MySQL [User Variables](https://dev.mysql.com/doc/refman/5.7/en/user-variables.html).

Slightly tweaking Dante, "Abandon all common-sense, ye who enter here."  User Variables are weird.

About the best article I've found on the subject is:

[Advanced MySQL User Variable Techniques](https://www.xaprb.com/blog/2006/12/15/advanced-mysql-user-variable-techniques/)

Which focuses on getting the desired behavior out them, rather than understanding, or god forbid, predict their outcomes.

{% highlight sql %}
CREATE TABLE attendance(
   id   INTEGER  NOT NULL
  ,date DATE  NOT NULL
);
INSERT INTO attendance(id,date) VALUES (1,'2012-09-10');
INSERT INTO attendance(id,date) VALUES (1,'2012-09-11');
INSERT INTO attendance(id,date) VALUES (1,'2012-09-12');
INSERT INTO attendance(id,date) VALUES (1,'2012-09-13');
INSERT INTO attendance(id,date) VALUES (1,'2012-09-14');
INSERT INTO attendance(id,date) VALUES (1,'2012-10-11');
INSERT INTO attendance(id,date) VALUES (1,'2012-10-12');
INSERT INTO attendance(id,date) VALUES (1,'2012-10-13');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-09');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-10');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-11');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-12');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-17');
INSERT INTO attendance(id,date) VALUES (2,'2012-08-22');
INSERT INTO attendance(id,date) VALUES (2,'2012-09-23');
INSERT INTO attendance(id,date) VALUES (4,'2012-10-01');
INSERT INTO attendance(id,date) VALUES (4,'2012-10-02');
INSERT INTO attendance(id,date) VALUES (4,'2012-10-03');
INSERT INTO attendance(id,date) VALUES (4,'2012-10-04');
INSERT INTO attendance(id,date) VALUES (4,'2012-11-01');
INSERT INTO attendance(id,date) VALUES (4,'2012-11-02');
INSERT INTO attendance(id,date) VALUES (4,'2012-11-03');
INSERT INTO attendance(id,date) VALUES (4,'2012-11-22');
INSERT INTO attendance(id,date) VALUES (5,'2012-11-01');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-01');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-02');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-03');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-04');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-05');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-06');
INSERT INTO attendance(id,date) VALUES (5,'2012-12-07');
INSERT INTO attendance(id,date) VALUES (5,'2013-01-23');
INSERT INTO attendance(id,date) VALUES (5,'2013-01-24');
INSERT INTO attendance(id,date) VALUES (5,'2013-01-28');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-02');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-03');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-04');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-05');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-06');
INSERT INTO attendance(id,date) VALUES (5,'2013-02-07');
{% endhighlight %}

The goal is to convert these data into a `start_date` and `stop_date` which would _greatly_ reduce the storage needs.

The first thing to do is detect the breaks. For `id` 1 the `start_date` and `stop_date` equivalents would look like:

| id | date     | 
|----|----------| 
| 1  | **09/10/12** | 
| 1  | 09/11/12 | 
| 1  | 09/12/12 | 
| 1  | 09/13/12 | 
| 1  | **09/14/12** | 
| 1  | **10/11/12** | 
| 1  | 10/12/12 | 
| 1  | **10/13/12** | 

We want to end up with a table like below, which we will call occurrences.

|id | start_occurrence | end_occurrence |
|---|------------------|----------------|
| 1 |  09/20/12        | 09/14/2012     |
| 1 |  10/11/22        | 10/13/2012     |

To transform the data into this table it's important to know user variables can hold a value from row to the next.

{% highlight sql %}
SELECT
    id, date, @row_number:=@row_number + 1 row_num
FROM
    attendance
        CROSS JOIN
    (SELECT @row_number:=0) r;
{% endhighlight %}

This should produce the following table:

| id  | date     | row_num   | 
|---|------------|----| 
| 1 | 2012-09-10 | 1  | 
| 1 | 2012-09-10 | 2  | 
| 1 | 2012-09-11 | 3  | 
| 5 | 2013-02-07 | 4  | 
| 5 | 2013-02-07 | 5  | 
| 5 | 2013-02-07 | 6  | 
| 5 | 2013-02-07 | 7  | 
| 5 | 2013-02-07 | 8  | 
| 5 | 2013-02-07 | 9  | 
| ... | ... | ... |