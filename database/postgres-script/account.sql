drop table account;


create table account (
    account_cd  varchar(20) unique not null,
    account_nm  varchar(100)    not null,
    updated_by  varchar(20)  not null default current_user,
    updated_dt  timestamp   not null default current_timestamp
);

alter table account add constraint account_pk primary key (account_cd);

