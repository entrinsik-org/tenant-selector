# tenant-selector

Enables Entrinsik Informer to derive the tenant id from a request using one of 2 strategies

### Installation
    informer plugin @entrinsik/informer-tenant-selector
    npm install @entrinsik/informer-tenant-selector --save

### Usage

2 strategies available:
* **subdomain** (default) : extract the tenant id from the subdomain of the request url, using an optional tenantMap.
* **header**: pass tenant id in a header 'x-inf-tenant', using an optional tenantMap.

**defaultsTo** If you want requests with no defined header (only possible with header strategy), define that tenant here. Default behavior is to error out if tenant is undefined.

Sample config:

    {
        "strategy" : "header",
        "tenantMap" : {
            "electra": "inquisitiv"
        },
        "defaultsTo" : "manager"
    }

Above, the tenant selection strategy is "header", meaning that a proxy would decorate the request with a header 'X-INF-TENANT'. Since a tenantMap
is provided, if the header value was "electra", the returned tenant id would be "inquisitiv." If no header is in the request, tenant will be set to "manager."

In the absence of any config options, the strategy would be "subdomain" and there would be no substitution of the subdomain for another tenant id.


