import { document } from "src/utils/dynamodbClient";
import {v4 as uuidV4} from "uuid"

interface ICreateTodo{
  title: string;
  deadline: string;
}

export const handle = async (event) =>{
  
  const {title,deadline} = JSON.parse(event.body) as ICreateTodo;
  const {userid: user_id} = event.pathParameters;

  const id = uuidV4();

  const data = new Date(deadline).toISOString();

  await document.put({
    TableName: "todos",
    Item:{
      id,
      user_id,
      title,
      done: false,
      deadline: data
    }
  }).promise();

  const response = await document.query({
    TableName: "todos",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues:{
      ":id": id
    }
  }).promise();

  if(response.Count === 0){
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Todo nao criado!"
      })
    }
  }

  const todo = response.Items[0];

  return {
    statusCode: 201,
    body: JSON.stringify({
      todo
    }),
    headers:{
      "Content-type": "application/json"
    }
  }
}