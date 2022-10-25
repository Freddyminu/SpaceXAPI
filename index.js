/*
  This Node.js application was created with the objective of
  the extraction of the name and mission of active SpaceX ships
  using the https://api.spacex.land/graphql/ graphl API endpoint.
*/

// Importing modules processing graphql-requests and converting the shipData object to csv
import { request, gql } from 'graphql-request'
import ObjectsToCsv from 'objects-to-csv'

/*
  The query used with the spacex API, it takes all the ships
  with their respective names, missions and active status.
*/
const QUERY = gql`
  {
    launchesPast {
      ships {
        name
        active
      }
      mission_name
    }
  }
`

// The SpaceX API endpoint
const API_ENDPOINT = 'https://api.spacex.land/graphql/'

// Function used to produce a csv file containing all active ships
async function getSpacexShipsCsv () {
  const shipArray = []

  // The request made to the SpaceX API endpoint.
  const data = await request(API_ENDPOINT, QUERY)
  // Interating each mission in the request.
  for (const mission of data.launchesPast) {
    // Only using missions with ships in them.
    if (mission.ships.length > 0) {
      // Interating each ship in the mission.
      for (const ship of mission.ships) {
        // Only using ships with names and that are active.
        if (ship?.name.length > 0 && ship.active === true) {
          const shipData = {}
          shipData.Mission_Name = mission.mission_name
          shipData.Ship_Name = ship.name
          shipArray.push(shipData)
        }
      }
    }
  }

  // Creating and populating the csv file
  const csv = new ObjectsToCsv(shipArray)
  csv.toDisk('./ShipData.csv')
}

getSpacexShipsCsv()
