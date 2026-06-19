CREATE TABLE data (
  trx_id           NUMBER        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  region           VARCHAR2(50)  NOT NULL,  
  deport           VARCHAR2(100) NOT NULL,
  acc_number       NUMBER(20)    NOT NULL,
  acc_name         VARCHAR2(250) NOT NULL,
  trx_date         DATE          NOT NULL,
  invoice_number   NUMBER(20)    NOT NULL,
  volume           NUMBER(20)    NOT NULL,
  value            NUMBER(20)    NOT NULL,
  emp_name         VARCHAR2(50)  NOT NULL,
  created_at       DATE          DEFAULT SYSDATE NOT NULL
);

SELECT * FROM data ;