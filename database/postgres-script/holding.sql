drop table holding;

create table holding (
    account_cd  varchar(20)  not null,
    stock_cd varchar(20) not null,
    exchange varchar(20) null,
    unit numeric not null,
    book_cost numeric not null,
    updated_by  varchar(20) default current_user not null,
    updated_dt  timestamp default current_timestamp  not null
);

alter table holding add constraint holding_pk primary key (account_cd, stock_cd);
