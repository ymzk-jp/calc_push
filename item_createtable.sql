use test;
create table `item`
(
    `id` int(10) unsigned not null auto_increment,
    `item` text not null,
    `count` int(10) unsigned not null,
    PRIMARY key(`id`)
)ENGINE= InnoDB

