# Build Validation

Validated in the patch environment:

```bash
npm run types
# passed

npm run build
# passed

find app routes database -name '*.php' -print0 | xargs -0 -n1 php -l
# passed

php artisan route:list
# passed, 263 routes discovered
```

PHPUnit/Pest could not run in this container because the PHP DOM extension is missing:

```text
Class "DOMDocument" not found
```

Install/enable PHP XML/DOM locally, then run:

```bash
php artisan test
```

Recommended Ubuntu package:

```bash
sudo apt install php-xml
```
