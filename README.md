# tenant-selector

Enables Entrinsik Informer to derive the tenant id from a request using one of 3 strategies

### Installation
    informer plugin @entrinsik/informer-tenant-selector
    npm install @entrinsik/informer-tenant-selector --save

### Usage

3 strategies available:
* **subdomain** (default) : extract the tenant id from the subdomain of the request url, using an optional tenantMap.
* **header**: pass tenant id in a header 'x-inf-tenant', using an optional tenantMap
* **context**: pass the tenant id in the first section of the path of the url, using an optional tenantMap

Sample config:

    {
        "strategy" : "header",
        "tenantMap" : {
            "electra": "inquisitiv"
        }
    }

Above, the tenant selection strategy is "header", meaning that a proxy would decorate the request with a header 'X-INF-TENANT'. Since a tenantMap
is provided, if the header value was "electra", the returned tenant id would be "inquisitiv"

In the absence of any config options, the strategy would be "subdomain" and there would be no substitution of the subdomain for another tenant id.


