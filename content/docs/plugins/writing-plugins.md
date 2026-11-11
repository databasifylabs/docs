---
title: Writing plugins
description: The package layout, the plugin class and the provider builders.
---

The fastest start is one of the example plugins. Each is a GitHub template: choose **Use this template**, rename it, and install your copy.

- [`example-dns-plugin`](https://github.com/databasifylabs/example-dns-plugin) for a DNS provider
- [`example-server-plugin`](https://github.com/databasifylabs/example-server-plugin) for a server provider
- [`example-database-plugin`](https://github.com/databasifylabs/example-database-plugin) for a database engine

## Layout

```
composer.json                               package name, version, autoload, plugin class
src/ExampleDnsPlugin.php                    the plugin, a Laravel service provider
src/ExampleDns.php                          the driver
public/icon.svg                             plugin icon, shown on the Plugins page
public/icons/dns-providers/example-dns.svg  provider icon
```

Databasify only reads `composer.json`, the folders it autoloads, a bundled `vendor/` and `public/`. Other folders, such as `resources/views` or `database/migrations`, are loaded by your plugin class.

## composer.json

```json
{
    "name": "acme/clickhouse",
    "version": "1.0.0",
    "autoload": { "psr-4": { "Acme\\Clickhouse\\": "src/" } },
    "extra": {
        "databasify": {
            "plugin": "Acme\\Clickhouse\\ClickhousePlugin",
            "requires": "^0.1",
            "icon": "icon.svg"
        }
    }
}
```

| Key | Meaning |
| --- | --- |
| `name` | Required. The part after the slash is the **plugin id** (`clickhouse`): lowercase letters, digits and dashes, at most 40 characters, unique among installed plugins, and not `core`. |
| `version` | Shown on the Plugins page. Defaults to `dev`. |
| `autoload.psr-4` | Required. Databasify registers these namespaces itself. Nothing runs `composer install` on the server. |
| `extra.databasify.plugin` | Required. The plugin class. |
| `extra.databasify.requires` | The Databasify versions the plugin works with, as a Composer-style constraint: `^0.1`, `~0.1.2`, `>=0.1 <0.3`, `^0.1 \|\| ^1.0`. Install and update refuse a plugin that doesn't match, and a plugin that stops matching after an upgrade is skipped with an error. Leave it out to allow any version. |
| `extra.databasify.icon` | A file in `public/` shown beside the plugin. Defaults to `icon.svg`, if it exists. |

`config('app.version')` returns the running Databasify version, for example `0.1.0`.

**Dependencies.** Databasify's own packages, including Laravel, are already loaded. If your plugin needs other packages, run `composer install --no-dev` and ship `vendor/` in the zip. Databasify loads `vendor/autoload.php` when it is there.

## The plugin class

A plugin extends `App\Plugins\AbstractPlugin`, which is a Laravel `ServiceProvider`:

```php
use App\Plugins\AbstractPlugin;

final class ClickhousePlugin extends AbstractPlugin
{
    public function register(): void
    {
        $this->app->singleton(ClickhouseClient::class);
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'clickhouse');
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        $this->databasify()->database('clickhouse')
            ->label('ClickHouse')
            ->image('ghcr.io/acme/databasify-clickhouse')
            ->register();
    }
}
```

| Method | Runs | Use it for |
| --- | --- | --- |
| `register()` | On every request and worker start, before `boot()` | Container bindings |
| `boot()` | On every request and worker start | Registering providers with `$this->databasify()`, plus `loadViewsFrom`, `loadMigrationsFrom`, `loadRoutesFrom` and `commands` |
| `install()` | Once, after the plugin is installed and its migrations ran | One-time setup |
| `uninstall()` | Once, before its migrations are rolled back and its files deleted | Cleanup, such as deleting stored files |
| `enable()` | When the plugin is switched on | Resuming work paused in `disable()` |
| `disable()` | When the plugin is switched off | Pausing work, such as cancelling scheduled jobs |

All six can type-hint dependencies, and the container fills them in.

- If `register()` or `boot()` throws, the plugin is skipped. Anything it registered is rolled back, and the error is shown on the Plugins page.
- If `install()` throws, the install is undone.
- If `uninstall()`, `enable()` or `disable()` throws, nothing changes and the error is shown.

## Registering providers

`$this->databasify()` hands out a builder for each kind: `dns($id)`, `server($id)` and `database($id)`. Every builder has:

| Method | Meaning |
| --- | --- |
| `label(string)` | Name shown in the UI |
| `handler(class-string)` | DNS and server providers: the driver class. It must extend the kind's abstract driver, listed below. Database engines have no driver |
| `form(DynamicForm)` | DNS and server providers: the inputs asked for when an account is added. See [Forms](#forms) |
| `icon(string)` | Icon URL. Defaults to `public/icons/<kind>-providers/<id>.svg` in your plugin, where `<kind>` is `dns`, `server` or `database` |
| `instructions(list<string>)` | Steps shown beside the credential inputs. `[label](https://…)` becomes a link and `` `value` `` a chip |
| `register()` | Adds the provider. Throws if the id is taken, so a plugin can't replace a built-in provider |

Use `$this->databasify()->asset('path/in/public')` for the URL of any other file in `public/`.

Drivers that call an HTTP API do it through `App\Services\Providers\ProviderHttp`, the way the built-in drivers do. It sets timeouts, retries reads and turns API errors into `ProviderRequestFailed`, which Databasify shows to the user:

```php
private function http(): PendingRequest
{
    return ProviderHttp::for(
        'Acme DNS',
        'https://api.acme.test/v1',
        $this->dnsProvider->credentials['token'] ?? '',
        fn (Payload $payload): ?string => $payload->string('error.message'),
    );
}

$zones = ProviderHttp::get($this->http(), 'zones')->json('zones');
```

### DNS providers

```php
$this->databasify()->dns('example-dns')
    ->label('Example DNS')
    ->handler(ExampleDns::class)
    ->form(DynamicForm::make([
        DynamicField::make('account')->text()->label('Account name'),
        DynamicField::make('token')->password()->label('Any token'),
    ]))
    ->instructions(['Fill in any account name and token.'])
    ->register();
```

The driver extends `App\DnsProviders\Drivers\AbstractDnsDriver`, is built around its account (`$this->dnsProvider`), and implements:

| Method | Does |
| --- | --- |
| `static id()` | The provider id |
| `verify()` | Throws `ProviderRequestFailed` when the credentials don't work |
| `zones()` | The domains, as `DnsZoneData(externalId, name)` |
| `records(zoneId, type, name)` | The records of one `DnsRecordType` (`A`, `Srv`, `Txt`) at a hostname |
| `createRecord(zoneId, DnsRecord)` | Creates one record |
| `deleteRecord(zoneId, DnsRecord)` | Deletes one record, found by its `id` |

A record is `DnsRecord(type, name, content, id, managed)`. `content` is the address for `A`, the text for `TXT`, and `"<priority> <weight> <port> <target>"` for `SRV`. The driver only does record CRUD: Databasify decides which records should exist and creates or deletes the difference.

**Mark your records.** Return `managed: true` only for records your driver created, for example ones carrying the `DnsRecord::MARKER` comment. Databasify refuses to take over a hostname that already has records it didn't create.

See the [example DNS plugin](https://github.com/databasifylabs/example-dns-plugin) and the built-in Cloudflare driver in `app/DnsProviders/Drivers/Cloudflare`.

### Server providers

```php
$this->databasify()->server('acme-cloud')
    ->label('Acme Cloud')
    ->handler(AcmeCloud::class)
    ->form(DynamicForm::make([DynamicField::make('token')->password()->label('API token')]))
    ->serverLabel('instance')
    ->sshUser('root')
    ->images(['ubuntu-24.04' => 'ubuntu-24-04', 'debian-13' => 'debian-13'])
    ->register();
```

- `serverLabel()` is what your cloud calls a server, for example droplet or instance.
- `sshUser()` is the user new servers accept SSH keys for.
- `images()` maps each operating system you offer to your cloud's image id. The keys are `ubuntu-24.04`, `ubuntu-26.04`, `debian-12`, `debian-13`, `rocky-9` and `almalinux-9`.

The driver extends `App\ServerProviders\Drivers\AbstractServerDriver`, is built around its account (`$this->serverProvider`), and implements:

- `static id()` and `verify()`, as for DNS;
- `regions()`, `plans(region)` and `networks(region)`;
- `createNetwork(region, name)` and `deleteNetwork(externalId)`;
- `findKey(publicKey)`, which returns the id of an uploaded key with that public key or `null`, and `createKey(name, publicKey)`, which uploads it;
- `createServer(NewProviderServer)`, `findServer(id)` and `deleteServer(id)`.

Providers only order, find and delete servers. See the [example server plugin](https://github.com/databasifylabs/example-server-plugin) and the built-in Hetzner and DigitalOcean drivers in `app/ServerProviders/Drivers`.

### Database engines

Databasify runs every engine through the `databasify` command inside the engine's container image. The image does the work on the server; the plugin only registers the engine, so it has no driver class and no server scripts.

```php
use App\DTOs\Databases\ConnectionProfile;

$this->databasify()->database('clickhouse')
    ->label('ClickHouse')
    ->category('Application')
    ->image('ghcr.io/acme/databasify-clickhouse')
    ->versions('25.8', [['value' => '25.8', 'label' => 'ClickHouse 25.8']])
    ->connection(new ConnectionProfile(
        uriScheme: 'clickhouse',
        uriQuery: '?secure=true',
        tlsParameter: 'secure',
        tlsMode: 'true',
        command: 'clickhouse-client --secure -h {host} --port {port} -u {username} --password {password} -d {database}',
        fixedUsername: null,
        selectsDatabase: true,
        envKeys: ['host' => 'DB_HOST', 'port' => 'DB_PORT', 'username' => 'DB_USERNAME', 'password' => 'DB_PASSWORD', 'database' => 'DB_DATABASE'],
    ))
    ->failoverHint('ClickHouse Keeper needs three members to keep a majority. Add one more standby.')
    ->register();
```

| Method | Meaning |
| --- | --- |
| `category()` | `Application` or `Caching`, which groups the engine on the create page |
| `image()` | The container image without a tag. Defaults to `ghcr.io/databasifylabs/databasify-<id>` |
| `versions(default, lines)` | The version lines offered. Each line is a tag prefix: Databasify picks the newest `<line>.x` tag and pins its digest. Add `'recovery' => false` to a line without point-in-time recovery |
| `connection(profile, withPublicCertificate, service)` | How the connection details page builds the URI, the CLI command and the `.env` keys. `withPublicCertificate` replaces it once a domain with a public certificate is attached, and `service` adds a DNS-discovered connection, such as `mongodb+srv://` |
| `environment(laravelConnection, extra)` | The Laravel connection name for the `.env` snippet, such as `pgsql`, plus extra keys |
| `migrationSource(defaultPort, credentialsRequired, selectsDatabases)` | Lets users migrate into this engine, and sets what the source form asks for |
| `failoverHint()` | The text shown when failover can't happen on its own |
| `serviceRecord(prefix, options)` | Publish an SRV and TXT record for DNS-discovered clients, as MongoDB does |
| `publicCertificate()` | Serve the zone's public certificate when a domain is attached, instead of the database's own CA |
| `persistenceChoice()` | Let users choose snapshot or append-only persistence |
| `readOnlyNodesVote()` | Count read-only nodes as failover voters, as Sentinel does |

In a `ConnectionProfile`, `{host}`, `{port}`, `{username}`, `{password}`, `{database}` and `{ca}` in the command and notes are filled in for each database. `fixedUsername` names a user the engine always connects as, such as `default`, and `envKeys` maps each value to its `.env` key, or `null` to leave it out.

**The image.** It runs the `databasify` command and answers the engine API contract in [`databasifylabs/engine-api`](https://github.com/databasifylabs/engine-api): one JSON object on stdin and one on stdout, quick commands that reply at once, and long commands that start an operation Databasify polls. A command your engine doesn't offer answers `unsupported`, and Databasify hides that feature instead of failing. Label the image `io.databasify.engine=<name>`; that name, not the plugin id, names the container (`databasify-<name>`) and its data folder (`/srv/<name>`). Publish exact `<line>.x` release tags, and run the contract's conformance suite against the image before you publish it.

The [example database plugin](https://github.com/databasifylabs/example-database-plugin) registers **Example Cache** on the official Valkey image, so it needs no image of its own. The built-in engines are registered the same way in `app/Providers/EngineServiceProvider.php`, and their images live in [`databasifylabs/engines`](https://github.com/databasifylabs/engines).

## Forms

DNS and server providers declare the inputs they need with `->form()`:

```php
use App\DTOs\Forms\DynamicField;
use App\DTOs\Forms\DynamicForm;

->form(DynamicForm::make([
    DynamicField::make('token')->password()->label('API token'),
    DynamicField::make('region')->select(['eu' => 'Europe', 'us' => 'United States'])->default('eu'),
    DynamicField::make('endpoint')->text()->placeholder('https://api.example.com')->optional(),
    DynamicField::make('private_key')->textarea()->description('PEM, including the BEGIN and END lines.'),
]))
```

| Method | Meaning |
| --- | --- |
| `text()`, `password()`, `textarea()`, `select([value => label])` | The input type. Defaults to `text()` |
| `label()`, `description()`, `placeholder()`, `default()` | What the input shows. The label defaults to the name |
| `optional()` | The field may be left empty. Fields are required otherwise |

Values are validated, encrypted and stored with the account. Read them by name in the driver, for example `$this->dnsProvider->credentials['token']`. Use `password()` for anything secret. When an account is edited, a field left blank keeps its stored value.

## Icons and other files

Everything in `public/` is served at `/plugin-assets/<plugin id>/…`. Icons are best as square SVGs.

## Test your plugin

Zip the folder and install it from the Plugins page with **Install plugin → Upload a zip**, or push it to GitHub and install `owner/repo`. Installed plugins are recorded in the `plugins` table and their files live in `storage/plugins/<plugin id>`. Use **Update** to load a new version.
