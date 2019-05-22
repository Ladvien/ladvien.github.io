---
layout: post
title: Understanding the MySQL Query
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
When the data are presented like this, it appear similar to our traditional Excel spreadsheet, right?  Let's compare the SQL query and a spreasheet.

[img] 

# SELECT
```sql
SELECT 1=1
```

# FROM
```sql
SELECT *
FROM employees
```
# FIELD
```
SELECT employees.emp_no,
       employees.first_name,
       employees.last_name
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
