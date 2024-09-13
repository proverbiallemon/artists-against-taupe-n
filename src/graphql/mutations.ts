/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createContact = /* GraphQL */ `mutation CreateContact($input: CreateContactInput!) {
  createContact(input: $input) {
    createdAt
    email
    id
    name
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateContactMutationVariables,
  APITypes.CreateContactMutation
>;
export const deleteContact = /* GraphQL */ `mutation DeleteContact($input: DeleteContactInput!) {
  deleteContact(input: $input) {
    createdAt
    email
    id
    name
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteContactMutationVariables,
  APITypes.DeleteContactMutation
>;
export const updateContact = /* GraphQL */ `mutation UpdateContact($input: UpdateContactInput!) {
  updateContact(input: $input) {
    createdAt
    email
    id
    name
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateContactMutationVariables,
  APITypes.UpdateContactMutation
>;
