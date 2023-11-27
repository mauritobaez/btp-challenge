const axios = require('axios');
const chai = require('chai');
const { expect } = chai;

const url = 'http://localhost:4004/odata/v4/project-manager/Project';


// Simple DELETE
async function performDelete(projectIdToDelete, credentials) {

  try {
    // Assertion: Check if the DELETE operation is successful
    const deleteResponse = await axios.delete(`${url}(${projectIdToDelete})`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });
    expect(deleteResponse.status).to.equal(204);

    console.log('DELETE Operation has been Successful!');
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// Simple POST
async function performPost(postData, expectedData, credentials) {
  
  try {  
    const postResponse = await axios.post(url, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
    });
    expect(postResponse.status).to.equal(201);
    expect(postResponse.data).to.deep.equal(expectedData);

    console.log('POST Operation has been Successful!');
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

async function performPostOfAlreadyExistentProject(postData, credentials) {
  
    try {  
      const postResponse = await axios.post(url, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });
      
      if (postResponse.status === 201){
        console.log('POST Operation of already existing Project. Cleaning up...');
    
        await axios.delete(`${url}(${postData.ID})`, {
            headers: {
            'Authorization': `Basic ${actual_credentials}`, 
            },
        });
      }
      
      expect.fail('Expected the request to fail due to already existing Project with the same ID');
    } catch (error) {
        expect(error.response.status).to.equal(400);
  
        console.log('POST Operation of Already Existing Project failed. Perfect!');
      
    }
  }

  async function performPostWithWrongCredentials(actual_credentials, actual_credentials, postData) {

    const wrongCredentials = Buffer.from('wronguser:wrongpassword').toString('base64');
  
    try {
      // Attempt to perform the POST operation with incorrect credentials
      const postResponse = await axios.post(url, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${wrongCredentials}`,
        },
      });
      // if the POST operation happens to go through, we need to cleanup the data afterwards
      if (postResponse.status === 201){
        console.log('POST Operation with Wrong Credentials: Request succeeded, cleaning up...');
    
        await axios.delete(`${url}(${postData.ID})`, {
            headers: {
            'Authorization': `Basic ${actual_credentials}`, 
            },
        });
      }
  
     
      expect.fail('Expected the request to fail with incorrect credentials, but it succeeded');
  
    } catch (error) {
      // 401 = Unauthorized
      expect(error.response.status).to.equal(401);
  
      console.log('POST Operation with Wrong Credentials: Unauthorized as expected');
    }
  }

async function performGetWhichDoesnotExist(nonExistentAuthorId) {
  try {
    
    const getResponse = await axios.get(`${url}(${nonExistentAuthorId})`);
    expect.fail(`Expected the request for ID ${nonExistentAuthorId} to fail, but it somehow succeeded`);

  } catch (error) {
    
    expect(error.response.status).to.equal(404);
    console.log(`GET Operation for ID ${nonExistentAuthorId}: Not Found. Excellent!`);
  }
}


async function performPutForExistentProject(projectID, updatedData, credentials) {
    try {
      const putResponse = await axios.put(`${url}(${projectID})`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });
  
      expect(putResponse.status).to.equal(200);
      expect(putResponse.data.title).to.equal(updatedData.title);
  
      console.log('PUT Operation for an Existent Project succeeded!');
  
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
}


async function runOperations() {
    new_id = 999 // Be careful! This ID could exist!

    const expectedData = {
        "@odata.context": "$metadata#Project/$entity",
        "ID": new_id,
        "title": "An Awesome Title!",
        "description": "Something Quite Informative",
        "beginning": "2023-12-10",
        "leader_ID": null
    }
    const credentials = 'pepito:pepitoo';
    const credentials_base_64 = Buffer.from(credentials).toString('base64');
    
    const postData = {
        "ID": new_id, 
        "title": "An Awesome Title!", 
        "description": "Something Quite Informative", 
        "beginning": "2023-12-10"
    }

    await performPost(postData,expectedData, credentials_base_64);
    await performDelete(new_id, credentials_base_64, postData);
    await performPostWithWrongCredentials(credentials_base_64);
    await performGetWhichDoesnotExist(new_id);

    await performPost(postData,expectedData, credentials_base_64);
    await performPostOfAlreadyExistentProject(postData, credentials_base_64);
    await performDelete(new_id, credentials_base_64);

    const changedData = {
        "title": "Another Awesome Title!", 
        "description": "Something Even More Informative!", 
        "beginning": "2023-12-12"
    }

    await performPost(postData,expectedData, credentials_base_64);
    await performPutForExistentProject(new_id,changedData,credentials_base_64);
    await performDelete(new_id, credentials_base_64);

}   


runOperations();