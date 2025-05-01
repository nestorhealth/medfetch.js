.load ./build/linux/x86_64/medfetch.so

select id from medfetch('Patient');
select json from medfetch('Patient');

.quit
