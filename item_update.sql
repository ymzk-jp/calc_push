use `test`;
update `item` set count = count +1 where item = 'A';
select `item`, count from item;