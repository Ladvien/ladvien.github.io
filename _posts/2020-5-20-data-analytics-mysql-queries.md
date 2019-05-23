---
layout: post
title: Understanding the MySQL Query
categories: data
series: 
excerpt:
tags: [mysql, business intelligence, data analytics]
image: 
    feature: data-analytics-series/wood-files-jan-antonin-kolar.jpeg
comments: true
custom_css:
custom_js: 
---
Welcome back! Alright, now we know how to connect to a remote server from within MySQL Workbench, let's start writing some queries.

Here's a common SQL query:
```sql
    SELECT e.emp_no,
		   e.last_name,
           t.title
      FROM employees AS e
 LEFT JOIN titles 	 AS t
        ON e.emp_no = t.emp_no
     WHERE e.hire_date > '1999-12-31'
  ORDER BY e.last_name DESC;
```
This query produces the following table when run on our `employees` database.

| row_num   |   emp_no | last_name   | title           |
|---:|---------:|:------------|:----------------|
|  0 |    47291 | Flexer      | Staff           |
|  1 |    60134 | Rathonyi    | Staff           |
|  2 |    72329 | Luit        | Staff           |
|  3 |   108201 | Boreale     | Senior Engineer |
|  4 |   205048 | Alblas      | Senior Staff    |
|  5 |   222965 | Perko       | Senior Staff    |
|  6 |   226633 | Benzmuller  | Staff           |
|  7 |   227544 | Demeyer     | Senior Staff    |
|  8 |   422990 | Verspoor    | Engineer        |
|  9 |   424445 | Boreale     | Engineer        |
| 10 |   428377 | Gerlach     | Engineer        |
| 11 |   463807 | Covnot      | Engineer        |
| 12 |   499553 | Delgrande   | Engineer        |

When the data are presented like this, it appear similar to our traditional Excel spreadsheet, right?  

Let's go ahead and compare the SQL query and a spreadsheet.

![compare-excel-and-sql](../images/data-analytics-series/sql_to_excel_compare.png)

Now, here in a few weeks when you are SQL writing machine you'll notice this analogy between Excel and a SQL query breaks down.  But for now, let the above image comfort you in knowing the core functions of SQL are similar to those of a spreadsheet

* Selecting columns
* Filtering columns and rows
* Ordering rows
* Combining data sets

However, SQL has a lot of superpowers an Excel spreadsheets doesn't.  Of course, the tradeoff is you must leave behind the comfort of a graphical user interface.  But don't let it scare you off--it only takes a 3-4 months to get used to, but then you'll realize how much those graphical interfaces have been chaining you down.

Alright, but to the queries.  Let's take a look at the different parts of the query above.

# SELECT
The `SELECT` statement is how you choose what turns up in the results section.  If don't put something in the `SELECT` area, then you will not get anything.  It is most often used to retrieve data, called fields, from specific table within a database.

### Select Area
You may ask, what is the "SELECT area."  It is everything between the word `SELECT` until `FROM`.
```sql
SELECT -------------------------------
       -- ALL THIS IS THE SELECT AREA
       -------------------------------
FROM
```

### Select Fields
Each item you put in the `SELECT` area should be followed by a comma.  

For example:
```sql
    SELECT  emp_no,
            last_name,
            title
...
```
The code above requests three different fields be returned in the result set: `emp_no`, `last_name`, and `title`. 

I should point out, if you forget a comma it can get messy.  Often, the SQL server will send an error message, **but not always**.  As we will see later in this series.

### Select Calculations
The `SELECT` does more than retrieve data from tables within a database.  It can also perform on-the-fly calculations, such as

```sql
SELECT 1 + 1,
       2 *25,
       55 / 75,
```
This should return the following:

|    |   1 + 1 |   2 *25 |   55 / 75 |
|---:|--------:|--------:|----------:|
|  0 |       2 |      50 |    0.7333 |




# FIELD
A field in SQL is similar to the column in a spreadsheet.  It contains data of the same type on every row (more on datatypes later).  Fields may be referenced throughout a SQL query, but for them to show in the query results they must be included in the `SELECT` area--as we went over in the SELECT section above.
```sql
SELECT emp_no,
       first_name,
       last_name
FROM employees
```
The above query works fine.  However, try running the following query, which includes two tables.
```sql
SELECT emp_no,
       first_name,
       last_name
FROM employees
LEFT JOIN titles
    ON employees.emp_no = titles.emp_no
```
You will not get any results, only a error message from the database which states something like:
```
Error Code: 1052. Column 'emp_no' in field list is ambiguous	
```
This is because both the `employees` and `titles` table have a field named `emp_no` and the SQL program can't figure out which one you want.

To solve this, we add the table name plus `.` to the front of each field name.  This will tell the SQL program from which tables we would like to field--leaving no ambiguity.

Let's run the query again with table names.
```sql
SELECT employees.emp_no,
       employees.first_name,
       employees.last_name
FROM employees
LEFT JOIN titles
    ON employees.emp_no = titles.emp_no
```
This time we get the results we expected, without error.

Building on this, a good SQL coders will _always_ prepend the table name to the front of the query, whether it's required or not.  This prevents future mistakes.  

For example, let's say you wrote this code:
```sql
SELECT emp_no,
       salary
FROM salaries
```
And your code was put into production (a term meaning put to use by your business) then a year later another coder added a second table to the query without critically looking at the query as a whole (something a bad SQL coder forgets to do).  

The new query looks like this:
```sql
SELECT emp_no,
       salary,
       departments.name
FROM salaries
LEFT JOIN departments
    ON departments.emp_no = salaries.emp_no
```
Try to run this query.  You will find the same `field list is ambigous` error as we saw earlier.

The deeper lesson here is: **Treat coding like defensive driving.  Code in such a way your expect someone else to be reckless.**

SELECT  employees.emp_no,
        employees.first_name,
        employees.last_name
FROM employees
```


Table names
Fail query
Style guides





# FROM
```sql
SELECT *
FROM employees
```


# ORDER BY
```
SELECT employees.emp_no,
       employees.first_name,
       employees.last_name
FROM employees
ORDER BY employees.emp_no
```

```
SELECT employees.emp_no,
       employees.first_name,
       employees.last_name
FROM employees
ORDER BY employees.emp_no DESC
```

```
SELECT employees.emp_no,
       employees.first_name,
       employees.last_name
FROM employees
ORDER BY employees.emp_no ASC
```

```
SELECT employees.emp_no,
       employees.first_name,
       employees.last_name
FROM employees
ORDER BY employees.emp_no, employees.first_name
```

# WHERE
```
SELECT employees.emp_no,
       employees.first_name,
       employees.last_name
FROM employees
WHERE employees.emp_no = 10006
ORDER BY employees.emp_no, employees.first_name
```

# JOIN
