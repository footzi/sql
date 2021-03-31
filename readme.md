https://www.w3schools.com/sql/sql_alter.asp
про миграции - https://habr.com/ru/post/121265/?_ga=2.22580731.1525597107.1615402310-436888997.1607855722

- DDL (Data Definition Language) - CREATE, ALTER, DROP
- DML (Data Manipulation Language) - SELECT, INSERT, UPDATE, DELETE
- TCL (Transaction Control Language) - COMMIT, ROLLBACK, SAVEPOINT - механизм, который обеспечивает целостность данных
- DTL (Data Control Language) - GRANT, REVOKE, DENY - управление правами доступа

admin/admin 5432

# Типы
- smallint - 2 bytes, -32 768 to 32 768 
- integer - 4 bytes, -2 147 483 648 to 2 147 483 648
- bigint - 8 bytes - 2 в 64 степени
- decimal/numeric - +- 3.4 * 10 в 8 степени (подходит для точных расчетов)
- real/float4 - 4 bytes - 6 знаков после запятой
- double precision/float8/float - 8 bytes - 15 знаков после запятой 

- smallserial - 2 bytes, 1 to 32 768 (используются для автоинкримента)
- serial - 4 bytes, 1 to 2 147 483 648
- bigserial - 8 bytes, 1 to 2 в 64 степени

- char - текст c требуемой длинной (если меньше длины n, то добивается символами)
- varchar - текст c требуемой длинной (если меньше длины n, то НЕ добивается символами)
- text - текст любой длинны 
  
- boolean - true/false
- date - 4 bytes
- time - 8 bytes - 00:00:00 - 24:00:00
- timestamp - 8 bytes
- interval - 16 bytes (разница между двумя timestamp)
- timestamptz - 8 bytes - timestamp с часовыми поясами

# Создание БД
- CREATE DATABASE testdb (WITH - доп параметры)
- DROP TABLE testdb - удаление таблицы (нужно закрыть соединение с ней)
- DROP TABLE IF EXIST book - удаление таблицы если существует

# Создание ТАБЛИЦ
CREATE TABLE publisher (
	publisher_id int PRIMARY KEY,
	org_name varchar(128) NOT NULL,
	address text NOT NULL
    fk_publisher_id integer REFERENCES publisher(publisher_id) NOT NULL - добавление внешнего ключа
);

# Добавление данных в таблицу
INSERT INTO book
VALUES 
(1, 'HARRY POTTER AND PH STONE', '01139999999'),
(2, 'HARRY POTTER AND CHAMBER OF SECRETS', '01129999999')

# Добавление колонок в уже существующую таблицу
ALTER TABLE book
ADD COLUMN fk_publisher_id varchar(255);

# Удаление колонок
ALTER TABLE book
DROP COLUMN test;

# Связи между таблицами
- Первичный ключ идентифицируют данные внутри таблицы (primary key)
- Внешний ключ нужен для связи таблицы с другими таблицами (foreign key)
- Один ко многим - одно издательство может опубликовать много книг, но 1 книга может быть опубликована только одним издательством
- Один к одному - у одного человека может быть только 1 паспорт
- Многие ко многим - когда у одного автора может быть много книг и у одной книги много соавторов (моделируется всегда введением новой таблицы)

## Соединение таблицы book и publisher по внешнему ключу fk_publisher_id таблицы book и publisher_id таблицы publisher_id 
ALTER TABLE book
ADD CONSTRAINT fk_publisher_id
FOREIGN KEY (fk_publisher_id) REFERENCES publisher(publisher_id)

### Связка двух столбов по primary key в отношениях многий ко многим
CREATE TABLE book_author (
book_id int REFERENCES book(book_id),
author_id int REFERENCES author(author_id),
	CONSTRAINT book_author_pkey PRIMARY KEY (book_id, author_id) -- composite key
);

# Выборка
- SELECT *(все колонки) FROM products(название таблицы) - полная выборка всех столбцов
- SELECT product_id, product_name, unit_price FROM products - выборка определенных столбцов
- DISTINCT - выборка только уникальных значений - SELECT DISTINCT country FROM employees
- COUNT - вывод кол-ва строк - SELECT COUNT (*) FROM orders / SELECT COUNT (DISTINCT country) FROM employees
- WHERE - фильтрация c операциями сравнения (=, >, >=, <, <=, !=) - SELECT company_name, contact_name, phone FROM customers WHERE country = 'USA'
- AND, OR - логические операции - SELECT * from orders WHERE freight > 30 AND ship_country = 'USA'
- BETWEEN - интервал между двумя числами (границы включены) - SELECT * FROM orders WHERE freight BETWEEN 20 AND 40
- IN - включает в себя список значений, которые необходимо найти - SELECT * FROM customers WHERE country IN ('Mexico', 'Germany', 'USA', 'Canada')
- NOT IN - отрицание IN - SELECT * FROM customers WHERE country NOT IN ('Mexico', 'Germany', 'USA', 'Canada')
- ORDER BY - сортировка - ASC - по возрастанию, DESC - по убыванию - SELECT DISTINCT country FROM customers ORDER BY country DESC 
- MIN, MAX, AVG - вывод минимального, максимального и среднего значения - SELECT MIN(order_date) FROM orders WHERE ship_city = 'London'
- SUM - сумма - SELECT SUM(units_in_stock) FROM products
- LIKE - поиск по паттерну - SELECT last_name, first_name FROM employees WHERE first_name LIKE '%n'
- LIMIT - вывод только требуемого кол-ва записей SELECT product_name, unit_price FROM products LIMIT 10
- IS NULL - (IS NOT NULL) - проверка на NULL - SELECT ship_city, ship_region, ship_country FROM orders WHERE ship_region IS NOT NULL
- GROUP BY - группировка - SELECT ship_country, COUNT(*) from orders WHERE freight > 50 GROUP BY ship_country ORDER BY COUNT(*) DESC 
- HAVING - вторичный фильтр - аналог WHERE но указывается после него - SELECT category_id, SUM(unit_price * units_in_stock) FROM products WHERE discontinued != 1 GROUP BY category_id HAVING SUM(unit_price * units_in_stock) > 5000 ORDER BY SUM(unit_price * units_in_stock);
- UNION - объединение результатов двух запросов(UNION ALL - вывод с дубликатами записей) - SELECT country FROM customers UNION SELECT country FROM employees 
- INTERSECT - объединение результатов если записи есть в двух запросах одновременно SELECT country FROM customers INTERSECT SELECT country FROM suppliers
- EXCEPT - объединение результатов разницы(исключения) в двух запросах - SELECT country FROM customers EXCEPT SELECT country FROM suppliers


## Like
- % - заполнитель (placeholder) означающий 0 1 и более символов
- _ - ровно 1 любой символ
- LIKE `U%` - строки начинающиеся с U
- LIKE `%a` - строки кончающиеся на а
- LIKE `%John%` - строки содержащие John
- LIKE `J%n` - строки начинающиеся с J и кончающиеся на n
- LIKE `_oh_` - строки где 2,3 oh а 1 и 4 - любые

# JOINS
- INNER JOIN - внутренние соединение
- LEFT JOIN - (левая таблица - первая таблица) - внешние соединение - в результат попадают все записи из левой таблицы (если в правой нет соответствия, то будет NULL)
  SELECT product_name, suppliers.company_name, units_in_stock FROM products INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id ORDER BY units_in_stock DESC
-  RIGHT JOIN - вторая таблица - зеркальное отображение LEFT
- FULL JOIN - LEFT + RIGHT
- CROSS JOIN - декартово произведение - каждой записи слева сопоставляются все записи справа
- SELF JOIN - для построения иерархии (если есть ссылка в таблице на саму себя)

Пример:
- Найти активные (см. поле discontinued) продукты из категории Beverages и Seafood, которых в продаже менее 20 единиц. Вывести наименование продуктов, кол-во единиц в продаже, имя контакта поставщика и его телефонный номер.

SELECT product_name, category_name, contact_name, phone, units_in_stock FROM products <br>
JOIN categories ON categories.category_id = products.category_id <br>
JOIN suppliers ON suppliers.supplier_id = products.supplier_id <br>
WHERE category_name IN ('Beverages', 'Seafood') AND units_in_stock < 20 AND discontinued = 0

# USING
- Сокращение записи в соединении
- JOIN order_details ON orders.order_id = order_details.order_id - на JOIN order_details USING(order_id)

# AS (псевдонимы)
- SELECT COUNT(*) FROM employees - SELECT COUNT(*) AS employees_count FROM employees - переименовывает столбец count на employess_count
- SELECT category_id, SUM(unit_price * units_in_stock) AS total_price (ORDER BY total_price DESC)

# Подзапросы - запросы после выполнения основного запроса
- SELECT company_name FROM suppliers WHERE county IN (SELECT DISTINCT country FROM customers)
