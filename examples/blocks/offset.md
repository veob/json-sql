# Offset block example

Query:

``` js
var sql = jsonSql.build({
    table: 'table',
    offset: 5
});
```

Result:

``` js
sql.query
// select * from "table" offset 5;

sql.values
// {}
```