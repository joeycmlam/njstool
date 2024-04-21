# njstool

---------------------------------
HOW TO USE IT

it is very handy to use https://mockturtle.net to generate the json test case


---------------------------------
HOW TO RUN TEST

npm run test:jest       ==> run *.test.js for unit test
npm run test:cucumber   ==> run features/*.steps.ts for feature test with line of code coverage by using nyc
npm run merge-reports   ==> merge jest and cucumber line of code coverage
npm run generate-cucumber-html  ==> generate cucumber features test report in html format


---------------------------------
HOW TO BUILD

> npm run build
> npm install -g pkg
> pkg -t node14-win-x64,node14-macos-x64 .


HOW TO run mssql on docker
docker build -t my-mssql-server -f ./docker/docker.mssql.yml .
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourStrong!Password123' -p 1433:1433 -d my-mssql-server
docker start <container_id_or_name>

docker exec -it <container_id_or_name> /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'YourStrong!Password123' -d master -i ./mssql-script/setup.sql

docker exec -it fd7df0fddd9f /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'YourStrong!Password123' -d master -i ./mssql-script/account.sql



docker cp /Users/joeylam/repo/njs/njstool/database/db-script/account.sql 6ebd6b3cd84e:.
