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

I've recently was required to work with MySQL 10.0.  I was surprised to find MySQL 10.2 and less does not support some common [Windowing Functions](https://drill.apache.org/docs/sql-window-functions-introduction/), specifically, [Value Functions](https://drill.apache.org/docs/value-window-functions/) and [Rank Functions](https://drill.apache.org/docs/ranking-window-functions/).

Well, bummer.  I really needed them.

On top of it, I only had read access to the database without the ability to create a stored procedure.  Out of desperation, I found myself researching the possibility of creating my own functions using MySQL [User Variables](https://dev.mysql.com/doc/refman/5.7/en/user-variables.html).

Slightly tweaking Dante, "Abandon all normal, ye who enter here."  User variables are weird.

I've spent some time researching on the interweb and about the best article I've found on the subject is:

[Advanced MySQL User Variable Techniques](https://www.xaprb.com/blog/2006/12/15/advanced-mysql-user-variable-techniques/)

Which focuses on getting the desired behavior rather than understanding, or god forbid, predict their outcomes.  This article is going to stick with the same philosophy--I don't need to necessarily understand them, however, I want to be able to predict their behavior.

At this bottom of the article I've included the data used in this article.  You can insert it into a MySQL or MariaDB database and follow along. The goal is to convert these data into a `start_date` and `stop_date` which would _greatly_ reduce the storage needs.

The first thing to do is detect the breaks. For `id` 1 the `start_date` and `stop_date` equivalents would look like:

| id | date     | 
|----|----------| 
| 1  | ***09/10/12*** | 
| 1  | 09/11/12 | 
| 1  | 09/12/12 | 
| 1  | 09/13/12 | 
| 1  | ***09/14/12*** | 
| 1  | ***10/11/12*** | 
| 1  | 10/12/12 | 
| 1  | ***10/13/12*** | 

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

Pretty cool, right?  Now, if only we could get the row_number to reset whenever the `id` changes.  No worries, let's use another variable to store the `id` from the previous row so we can compare it to the current.

{% highlight sql %}
SELECT 
    id,
    date,
    @row_number:=@row_number + 1 row_number,
    IF(@previous_id = id,
        @row_number,
        @row_number:=0) calc1,
    @previous_id:=id cacl2
FROM
    attendance
        CROSS JOIN
    (SELECT @row_number:=0, @previous_id:=0) r;
{% endhighlight %}

This should give us the following output:

| id|date|row_number|calc1|cacl2| 
|---|------------|---|---|---| 
| 1 | 2012-09-10 | 1 | 0 | 1 | 
| 1 | 2012-09-10 | 1 | 1 | 1 | 
| 1 | 2012-09-11 | 2 | 2 | 1 | 
| 5 | 2013-02-07 | 3 | 0 | 5 | 
| 5 | 2013-02-07 | 1 | 1 | 5 | 
| ... | ... | ... | ... | ... | 

Notice, the `calc1` and `calc2` are not values you need.  They are merely calculations used to reset the row_number whenever the id changes.  Hmm, this is interesting--and, hopefully, you can see this has many possibilities.

Now, let's go back and think about our problem a little.

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

We can save a value from one row to the next.  Therefore, detecting the breaks in a range of attendance dates can be obtained by comparing the current row's `date` value to the previous row's `date` value.  If the previous row is greater than the current row minus one, then we know there was a break in the range.

{% highlight sql %}
SELECT 
    id, date, range_selector
FROM
    (SELECT DISTINCT
        id,
            date,
            IF(@previous_id = id, @range_selector, @range_selector:=0) calc1,
            IF(DATEDIFF(@previous_date, date) = 1, @range_selector, @range_selector:=@range_selector + 1) range_selector,
            @previous_id:=id calc2,
            @previous_date:=DATE(date) calc3
    FROM
        (SELECT DISTINCT
        *
    FROM
        attendance
    ORDER BY id DESC , date DESC) order_sub
    CROSS JOIN (SELECT 
        @id_selector:=0,
            @previous_date:=0,
            @range_selector:=0,
            @previous_id:=0
    ) variable_initialization
    ORDER BY id , date DESC) date_ranges;
{% endhighlight %}

This _should_ give the following table:

| id  | date | range_index | 
|---|------------|---| 
| 1 | 2012-10-13 | 1 | 
| 1 | 2012-10-12 | 1 | 
| 1 | 2012-10-11 | 1 | 
| 1 | 2012-09-14 | 2 | 
| 1 | 2012-09-13 | 2 | 
| 1 | 2012-09-12 | 2 | 
| 1 | 2012-09-11 | 2 | 
| 1 | 2012-09-10 | 2 | 
| 2 | 2012-09-23 | 1 | 
| 2 | 2012-08-22 | 2 | 
| 2 | 2012-08-17 | 3 | 
| 2 | 2012-08-12 | 4 | 
| 2 | 2012-08-11 | 4 | 
| 2 | 2012-08-10 | 4 | 
| 2 | 2012-08-09 | 4 | 
| 4 | 2012-11-22 | 1 | 
| 4 | 2012-11-03 | 2 | 
| 4 | 2012-11-02 | 2 | 
| 4 | 2012-11-01 | 2 | 
| 4 | 2012-10-04 | 3 | 
| 4 | 2012-10-03 | 3 | 
| 4 | 2012-10-02 | 3 | 
| 4 | 2012-10-01 | 3 | 
| 5 | 2013-02-07 | 1 | 
| 5 | 2013-02-06 | 1 | 
| 5 | 2013-02-05 | 1 | 
| 5 | 2013-02-04 | 1 | 
| 5 | 2013-02-03 | 1 | 
| 5 | 2013-02-02 | 1 | 
| 5 | 2013-01-28 | 2 | 
| 5 | 2013-01-24 | 3 | 
| 5 | 2013-01-23 | 3 | 
| 5 | 2012-12-07 | 4 | 
| 5 | 2012-12-06 | 4 | 
| 5 | 2012-12-05 | 4 | 
| 5 | 2012-12-04 | 4 | 
| 5 | 2012-12-03 | 4 | 
| 5 | 2012-12-02 | 4 | 
| 5 | 2012-12-01 | 4 | 
| 5 | 2012-11-01 | 5 | 

The reason I state "should", if you modify the order of the user variables, it'll break.  If you change the `order by`, it'll break.  If you add a `where` or `having` clause, it'll break.  Pretty much, it's as fragile a query as they come.

However, the clever bunch probably see where we are going with this.  Now, it's simply a matter of taking the `MIN()` and `MAX()` of of `date` and `group by` the `id` and `range_index`.


{% highlight sql %}
SELECT 
    id, min(date) start_date, max(date) end_date
FROM
    (SELECT DISTINCT
        id,
            date,
            IF(@previous_id = id, @range_selector, @range_selector:=0) calc1,
            IF(DATEDIFF(@previous_date, date) = 1, @range_selector, @range_selector:=@range_selector + 1) range_selector,
            @previous_id:=id calc2,
            @previous_date:=DATE(date) calc3
    FROM
        (SELECT DISTINCT
        *
    FROM
        attendance
    ORDER BY id DESC , date DESC) order_sub
    CROSS JOIN (SELECT 
        @id_selector:=0,
            @previous_date:=0,
            @range_selector:=0,
            @previous_id:=0
    ) r
    ORDER BY id , date DESC) date_ranges
    GROUP BY id, range_selector;
{% endhighlight %}

Which should provide us with output like:

|id | start_date |   end_date | 
|---|------------|------------| 
| 1 | 2012-10-11 | 2012-10-13 | 
| 1 | 2012-09-10 | 2012-09-14 | 
| 2 | 2012-09-23 | 2012-09-23 | 
| 2 | 2012-08-22 | 2012-08-22 | 
| 2 | 2012-08-17 | 2012-08-17 | 
| 2 | 2012-08-09 | 2012-08-12 | 
| 4 | 2012-11-22 | 2012-11-22 | 
| 4 | 2012-11-01 | 2012-11-03 | 
| 4 | 2012-10-01 | 2012-10-04 | 
| 5 | 2013-02-02 | 2013-02-07 | 
| 5 | 2013-01-28 | 2013-01-28 | 
| 5 | 2013-01-23 | 2013-01-24 | 
| 5 | 2012-12-01 | 2012-12-07 | 
| 5 | 2012-11-01 | 2012-11-01 | 

And there we go.  Not too amazing, but I couldn't find this answer by Googling, so I figure I'd add it to the great Wiki in the Sky.

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
