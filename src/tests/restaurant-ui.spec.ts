import { expect } from 'chai'
import { RestaurantPage } from '../logic/pages/restaurant-page'
import { BrowserWrapper } from '../infra/browser/browser'
import configJson from '../../config.json'
import { ApiResponse } from '../infra/rest/api-response'
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response'

import restaurantsAPI from '../logic/REST/restaurantsAPI'

let sizeOfTable

describe('UI tests', () => {
  let browser: BrowserWrapper
  let resturantPage: RestaurantPage

  beforeEach('Start browser', async () => {
    browser = new BrowserWrapper()
    resturantPage = await browser.newPage(RestaurantPage, configJson.baseUiUrl)
  })

  afterEach('Close browser', async () => {
    await browser.close()
  })

  it('Validate "Create new Restaurant Popup" opened', async function () {
    await resturantPage.clickreateNewRestaurantButtone()
    let actualResult = await resturantPage.checkIfTitleInPopupExcit()
    expect(actualResult, 'Restaurants popup was not opened').to.be.true
  })
  it('check there is no rest via UI', async function () {
    // Assume there is no restaurents by UI

    sizeOfTable = await resturantPage.checkRows()
    console.log(sizeOfTable)

    expect(sizeOfTable).to.be.equal(null)
  })
  it('check there is no rest via API', async function () {
    // Assume there is no restaurents double check by API
    const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants()
    console.log(restaurants)
    expect(restaurants.data?.length).to.be.equal(0) // we create only one restreunt so we expect that restaurants.length will be equal 1
  })
  it('create a new resteraunt', async function () {
    await resturantPage.clickreateNewRestaurantButtone()
    await resturantPage.fillnewrest()
    await delay(2000)
    await resturantPage.closePopUp()
    await delay(2000)
  })

  it('check if restruant was added via UI', async function () {
    sizeOfTable = await resturantPage.checkRows()
    console.log(sizeOfTable)

    expect(sizeOfTable?.length).to.be.equal(1)
  })

  it('check if restruant was added via API', async function () {
    const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants()
    console.log(restaurants)
    expect(restaurants.data?.length).to.be.equal(1) // we create only one restreunt so we expect that restaurants.length will be equal 1
    expect(restaurants.data?.length).to.be.equal(sizeOfTable.length)
  })

  it('delete resterunt', async function () {
    await delay(5000)
    await resturantPage.DeleteButton()
    let actualResult = await resturantPage.checkIfTitleDelteExcit() // after deleted should be popup message
    expect(actualResult).to.be.true
    await delay(5000)
  })
  it('check if restruant was deleted UI', async function () {
    sizeOfTable = await resturantPage.checkRows()
    console.log(sizeOfTable)

    expect(sizeOfTable).to.be.equal(null)
  })

  it('check if restruant was deleted', async function () {
    const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants()
    console.log(restaurants)
    expect(restaurants.data?.length).to.be.equal(0) // we create only one restreunt so we expect that restaurants.length will be equal 1
  })
})

function delay(time: any) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}
