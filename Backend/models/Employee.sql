CREATE TABLE employee (
  id               NUMBER        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  emp_id           VARCHAR2(20)  UNIQUE,
  emp_name         VARCHAR2(50)  NOT NULL,
  role             VARCHAR2(20)  NOT NULL,
  dob              DATE          NOT NULL,
  email            VARCHAR2(100) NOT NULL UNIQUE,
  password         VARCHAR2(250),
  is_temp_password NUMBER(1)     DEFAULT 1 NOT NULL,
  status           VARCHAR2(20)  DEFAULT 'PENDING' NOT NULL,
  created_at       DATE          DEFAULT SYSDATE NOT NULL
);
SELECT sys_context('USERENV', 'CON_NAME') FROM dual;

select * from employee;

TRUNCATE TABLE employee;
ALTER TABLE employee 
ADD region VARCHAR2(50);

ALTER TABLE employee 
MODIFY role VARCHAR2(20) NULL;

DELETE FROM employee WHERE EMP_ID IS NULL;
DELETE FROM employee WHERE IS_TEMP_PASSWORD = 1;

COMMIT;