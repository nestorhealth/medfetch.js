.load ./medfetch

create table rows as
select
    json_extract(json, 'id') as id,
    AGE(json, '')
