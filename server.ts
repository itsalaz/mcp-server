import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'


const server = new McpServer({
    name: 'Weather Data Fetcher',
    version: '1.0.0'
})


// define tool

server.tool(
    'trackPackage',
    'Track delivery status using tracking number',

{
    trackingNumber: z.string().describe('Package tracking number')
},

async ({trackingNumber}) => {
    return {
        content: [
            {
                type: 'text',
                text: `Checking delivery status for: ${trackingNumber}`
            }
        ]
    }
}
)

async function getWeatherByCity (city: string) {
    if(city.toLowerCase() === 'new york ') {
        return { temp: '22°C', forecast: 'Partly cloudy with a breeze'}
    }
    if (city.toLowerCase() === 'london') {
        return { temp: '16°C', forecast: 'Rainy and overcast' }
    }
    return { temp: null, error: 'Weather data not available in this city'}
}

// Challenge: 
// Create a tool called `getWeatherDataByCityName`
// It should take a city (New York or London) and return mock weather data as JSON text
// Use a helper like getWeatherByCity() to return data

server.tool(
    'getWeatherByCityName',
    'Get weather data for New York or London',
    {
        city: z.string().describe('Name of the city to get weather for')
    },
    async({city}) => {
        const weatherData = await getWeatherByCity(city)
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(weatherData)
                }
            ]
        }
    }
)

// Registering a static resource on the MCP server
server.resource(
    // URI: A unique identifier for this resource
    'flights://airports',

    //Description: Explains what this resource provides
    'List of supported airport codes',

    //MIME Type: Describes the format of the data being returned

    'text/plain',

    // Data Function: An async function that returns the actual content of the resource

    async() => {
    return `Supported Airports:
    - JFK (New York)
    - LHR (London Heathrow)
    - SFO (San Francisco)`;
    }
)


/**
 * Challenge: Create a static resource for the weather tool
 * Use URI: weather://cities
 * Return a plain text list of supported cities (e.g. London and New York)
 * Set content type to 'text/plain'
 */

server.resource(
    'weather://cities',
    'List of supported cities',
    'text/plain',
    async() => {
        return `Supported Cities:
        - London(UK)
        - New York(USA)`
    }
)

// Challenge:
// Inside the async function:
// 1. Define the stdio transport by creating a `const transport` object with a new instance of `StdioServerTransport`
// 2. Connect the server using `await server.connect(transport)`
// 3. Print status messages to the terminal using `console.error()` to indicate the server is running.

async function init() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error('Weather MCP Server Started!')
    console.error('Tool: getWeatherDataByCityName')
    console.error('Supported Cities: New York, London')
    console.error('Server Ready! ')
}
init().catch(console.error)