IF EXISTS (SELECT * FROM sys.tables WHERE name = 'holding' AND type = 'U')
    DROP TABLE holding;

CREATE TABLE holding (
    account_cd  VARCHAR(20) NOT NULL,
    stock_cd VARCHAR(20) NOT NULL,
    exchange VARCHAR(20) NULL,
    unit NUMERIC NOT NULL,
    book_cost NUMERIC NOT NULL,
    updated_by  VARCHAR(20) NOT NULL DEFAULT CURRENT_USER,
    updated_dt  DATETIME NOT NULL DEFAULT GETDATE()
);