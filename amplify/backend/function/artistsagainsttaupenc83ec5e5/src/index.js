import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Resend } from 'resend';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const resend = new Resend(process.env.re_2CUBSqou_ML8ppfp85issPGMUsjgAWum6);
const TABLE_NAME = process.env.dynamoaatpn;

export const handler = async (event) => {
  const { fieldName } = event.info;
  const args = event.arguments;

  switch (fieldName) {
    case 'createContact':
      return await createContact(args.input);
    case 'getContact':
      return await getContact(args.id);
    case 'listContacts':
      return await listContacts(args.nextToken, args.limit);
    case 'updateContact':
      return await updateContact(args.input);
    case 'deleteContact':
      return await deleteContact(args.input);
    default:
      throw new Error('Unknown field, unable to resolve ' + fieldName);
  }
};

async function createContact(input) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...input,
      createdAt: new Date().toISOString(),
      id: input.id || Date.now().toString()
    }
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    await sendEmail(params.Item);
    return params.Item;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

async function getContact(id) {
  const params = {
    TableName: TABLE_NAME,
    Key: { id }
  };

  try {
    const { Item } = await ddbDocClient.send(new GetCommand(params));
    return Item;
  } catch (error) {
    console.error('Error getting contact:', error);
    throw error;
  }
}

async function listContacts(nextToken, limit = 20) {
  const params = {
    TableName: TABLE_NAME,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined
  };

  try {
    const { Items, LastEvaluatedKey } = await ddbDocClient.send(new QueryCommand(params));
    return {
      items: Items,
      nextToken: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : null
    };
  } catch (error) {
    console.error('Error listing contacts:', error);
    throw error;
  }
}

async function updateContact(input) {
  const { id, ...updateData } = input;
  const updateExpression = Object.keys(updateData).map(key => `#${key} = :${key}`).join(', ');
  const expressionAttributeNames = Object.keys(updateData).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
  const expressionAttributeValues = Object.entries(updateData).reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {});

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: `SET ${updateExpression}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };

  try {
    const { Attributes } = await ddbDocClient.send(new UpdateCommand(params));
    return Attributes;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}

async function deleteContact(input) {
  const params = {
    TableName: TABLE_NAME,
    Key: { id: input.id },
    ReturnValues: 'ALL_OLD'
  };

  try {
    const { Attributes } = await ddbDocClient.send(new DeleteCommand(params));
    return Attributes;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}

async function sendEmail(contact) {
  try {
    await resend.emails.send({
      from: 'Artists Against Taupe <noreply@artistsagainsttaupe.com>',
      to: 'lemon.newby@gmail.com',
      reply_to: contact.email,
      subject: 'New Contact Form Submission',
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Message:</strong> ${contact.message}</p>
        <p><strong>Submitted at:</strong> ${contact.createdAt}</p>
      `
    });
    console.log('Email sent successfully for contact:', contact.email);
  } catch (error) {
    console.error('Error sending email:', error);
    // Note: We're not throwing the error here to prevent it from affecting the contact creation process
  }
}