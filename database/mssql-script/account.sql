IF EXISTS (SELECT * FROM sys.tables WHERE name = 'account' AND type = 'U')
    DROP TABLE account;

CREATE TABLE account (
    account_cd  VARCHAR(20) NOT NULL,
    account_nm  VARCHAR(100) NOT NULL,
    updated_by  VARCHAR(20) NOT NULL DEFAULT CURRENT_USER,
    updated_dt  DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_account PRIMARY KEY (account_cd)
);