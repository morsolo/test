import { ApiResponse } from '../infra/rest/api-response'
import { Restaurant } from '../logic/REST/API-Response/get-restaurants-response'
import { expect } from 'chai'

import restaurantsAPI from '../logic/REST/restaurantsAPI'

describe('Restaurants tests', () => {
  before('Reset restaurant server', async () => {
    //Arrange
    await restaurantsAPI.resetServer()
  })

  it('Validate the amount of restaurants', async () => {
    //Act
    const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants()
    console.log(restaurants)

    //Assert
    expect(restaurants.success).to.be.true
    const actualAmount = restaurants.data?.length
    expect(actualAmount).to.equal(3, 'Restaurants amount is not as expected')
  })

  it('Get restaurant by id', async () => {
    //Arrange
    const myNewRest = { address: 'My Addess 1', id: 233, name: 'My Restaurant', score: 2.3 }
    const createResponse = await restaurantsAPI.createRestaurant(myNewRest)

    //Act
    const getByIdResponse = await restaurantsAPI.getRestaurantById(233)

    console.log(getByIdResponse.data)

    //Assert
    expect(getByIdResponse.status).to.equal(200)
    expect(getByIdResponse.success).to.be.true
    expect(getByIdResponse.data).to.deep.equal(myNewRest)
  })

  it('Update exsisting restaurant', async () => {
    const getByIdResponse = await restaurantsAPI.getRestaurantById(233) // save the current data of id 233
    const newData = { address: 'My Addess 6', id: 233, name: 'Mor Restaurant', score: 2.3 } // create a new data
    //Act
    const patchByIdResponse = await restaurantsAPI.updateRestaurant(newData)

    //Assert
    expect(patchByIdResponse.status).to.equal(200)
    expect(patchByIdResponse.data).to.not.equal(getByIdResponse.data) // check that the data has changed
  })

  it('Delete exsisting restaurant', async () => {
    const getByIdResponse = await restaurantsAPI.getRestaurantById(233) // save the current data of id 233
    //Act
    const deleteByIdResponse = await restaurantsAPI.deleteRestaurantById(233)

    //Assert
    expect(deleteByIdResponse.status).to.equal(200)
  })

  it('Validate the amount of restaurants', async () => {
    //Act
    const restaurants: ApiResponse<Restaurant[]> = await restaurantsAPI.getRestaurants()
    console.log(restaurants)

    //Assert
    expect(restaurants.success).to.be.true
    const actualAmount = restaurants.data?.length
    expect(actualAmount).to.equal(3, 'Restaurants amount is not as expected')
  })

  it('Get non exsisting restaurant', async () => {
    //Act
    const getByIdResponse = await restaurantsAPI.getRestaurantById(233)

    //Assert
    expect(getByIdResponse.error).to.equal('restaurant with given id not found')
    expect(getByIdResponse.success).to.be.false
    expect(getByIdResponse.status).to.equal(404)
  })
})
