import { document } from "src/utils/dynamodbClient";

export const handle = async (event) =>{
  const {userid: user_id} = event.pathParameters;

  const params = {
    TableName: "todos",
    KeyConditionExpression: "id = :id",
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id
    }
  }
  
  const resp = await document.scan(params).promise();

  if(resp.Count === 0){
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Todo nao existe!"
      })
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      resp.Items
    )
  }

}