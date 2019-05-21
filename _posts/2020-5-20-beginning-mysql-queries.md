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
