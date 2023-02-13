import { Page } from 'playwright'
import { PageBase } from './page-base'

const CREATE_NEW_RESTURANT_BUTTON = "//button[contains(text(),'Create new')]"
const SUBMIT_BUTTON = "//button[contains(text(),'Submit')]"
const OK_BUTTON = "//button[contains(text(),'OK')]"
const DELETE_BUTTON = "//button[contains(text(),'X')]"
const POPUP_TITLE = "//h2[contains(text(),'Create new restaurant')]"
const DELETE_TITLE = "//h2[contains(text(),'Deleted!')]"

export class RestaurantPage extends PageBase {
  constructor(page: Page) {
    super(page)
  }

  clickreateNewRestaurantButtone = async () => {
    await this.page.click(CREATE_NEW_RESTURANT_BUTTON)
  }
  closePopUp = async () => {
    await this.page.click(OK_BUTTON)
  }
  DeleteButton = async () => {
    await this.page.click(DELETE_BUTTON)
  }

  checkIfTitleInPopupExcit = async () => {
    return await this.page.isVisible(POPUP_TITLE)
  }
  checkIfTitleDelteExcit = async () => {
    return await this.page.isVisible(DELETE_TITLE, { timeout: 2000 })
  }
  checkRows = async () => {
    try {
      await this.page.waitForSelector('tbody', {
        timeout: 5000,
      })
    } catch (error) {
      return null
    }
    const tbody = await this.page.$('tbody')
    if (tbody) {
      var tableData = []
      // Get all the rows in the tbody
      const rows = await tbody.$$('tr')

      // Iterate over the rows and extract the data
      for (const row of rows) {
        const cells = await row.$$('td')

        const data = []
        for (const cell of cells) {
          data.push(await (await cell.getProperty('textContent')).jsonValue())
        }
        tableData.push(data)
      }
      return tableData
    }
    return null
  }
  fillnewrest = async () => {
    await this.page.locator('id=id').fill('10')
    await this.page.locator('id=name').fill('mor')
    await this.page.locator('id=address').fill('haifa')
    await this.page.locator('id=score').fill('5.5')
    await this.page.click(SUBMIT_BUTTON)
  }
}
