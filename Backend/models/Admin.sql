CREATE TABLE admin (
  admin_id   NUMBER        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username   VARCHAR2(50)  NOT NULL UNIQUE,
  password   VARCHAR2(250) NOT NULL,
  created_at DATE          DEFAULT SYSDATE NOT NULL
);

select * from admin;