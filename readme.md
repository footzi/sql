https://www.w3schools.com/sql/sql_alter.asp

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

## Создание БД
- CREATE DATABASE testdb (WITH - доп параметры)
- DROP TABLE testdb - удаление таблицы (нужно закрыть соединение с ней)
- DROP TABLE IF EXIST book - удаление таблицы если существует

## Создание ТАБЛИЦ
CREATE TABLE publisher (
	publisher_id int PRIMARY KEY,
	org_name varchar(128) NOT NULL,
	address text NOT NULL
    fk_publisher_id integer REFERENCES publisher(publisher_id) NOT NULL - добавление внешнего ключа
);

## Добавление данных в таблицу
INSERT INTO book
VALUES 
(1, 'HARRY POTTER AND PH STONE', '01139999999'),
(2, 'HARRY POTTER AND CHAMBER OF SECRETS', '01129999999')

## Выборка
SELECT * FROM book - выбрать все из таблицы
SELECT DISTINCT name FROM book - выбрать только уникальные значения из столбца name

## Where


## Добавление колонок в уже существующую таблицу
ALTER TABLE book
ADD COLUMN fk_publisher_id varchar(255);

## Удаление колонок
ALTER TABLE book
DROP COLUMN test;

## Связи между таблицами
- Первичный ключ идентифицируют данные внутри таблицы (primary key)
- Внешний ключ нужен для связи таблицы с другими таблицами (foreign key)
- Один ко многим - одно издательство может опубликовать много книг, но 1 книга может быть опубликована только одним издательством
- Один к одному - у одного человека может быть только 1 паспорт
- Многие ко многим - когда у одного автора может быть много книг и у одной книги много соавторов (моделируется всегда введением новой таблицы)

### Соединение таблицы book и publisher по внешнему ключу fk_publisher_id таблицы book и publisher_id таблицы publisher_id 
ALTER TABLE book
ADD CONSTRAINT fk_publisher_id
FOREIGN KEY (fk_publisher_id) REFERENCES publisher(publisher_id)

### Связка двух столбов по primary key в отношениях многий ко многим
CREATE TABLE book_author (
book_id int REFERENCES book(book_id),
author_id int REFERENCES author(author_id),
	CONSTRAINT book_author_pkey PRIMARY KEY (book_id, author_id) -- composite key
);

