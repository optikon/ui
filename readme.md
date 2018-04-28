# optikon-ui

The Optikon UI is based on [Foundation for Sites](https://foundation.zurb.com/sites.html), and provides a user interface
for the Optikon API.



## Run in Docker

**Prerequisites**: [Docker](https://docs.docker.com/install/)

1. Procure a [Google Maps API token](https://developers.google.com/maps/documentation/javascript/get-api-key). (Optional - if not provided, you will be unable to see the edge cluster Map View in the UI).

2. Run the Optikon API -- [instructions](https://github.com/optikon/optikon-api).  

3. Run the UI container:

```
docker run -d --name optikon-ui -p 8000:8000 intelligentedgeadmin/optikon-ui:0.0.2 <optikon-api-url> <your-google-maps-key>`
```

4. Navigate to `localhost:8000` in a browser window, and you should see the UI with the "clusters" area on the left populated:

![screenshot](https://github.com/optikon/optikon-ui/tree/master/docs/screenshot.png)


## Run from source

**Prerequisites**: [Node.js](https://www.npmjs.com/get-npm)

To run from source, complete steps 1-2 above (google maps API token, run the optikon API), then:

1. clone this repo

2. Create a file, `env.json` in the UI repo root, as follows, populating the values with the IP/PORT of the Optikon API, and your Google Maps API token:

```
{
	"OPTIKON_API_URL": "http://<optikon-api-ip>:<port>",
	"GOOGLE_MAP_KEY": "<your-api-key>"
}
```

3. `npm install` from the repo root
4. `npm run start`. This should open the UI in a browser window at `localhost:8000`
