/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateContact = /* GraphQL */ `subscription OnCreateContact(
  $createdAt: AWSDateTime
  $email: String
  $id: String
  $name: String
) {
  onCreateContact(createdAt: $createdAt, email: $email, id: $id, name: $name) {
    createdAt
    email
    id
    message
    name
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateContactSubscriptionVariables,
  APITypes.OnCreateContactSubscription
>;
export const onDeleteContact = /* GraphQL */ `subscription OnDeleteContact(
  $createdAt: AWSDateTime
  $email: String
  $id: String
  $name: String
) {
  onDeleteContact(createdAt: $createdAt, email: $email, id: $id, name: $name) {
    createdAt
    email
    id
    message
    name
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteContactSubscriptionVariables,
  APITypes.OnDeleteContactSubscription
>;
export const onUpdateContact = /* GraphQL */ `subscription OnUpdateContact(
  $createdAt: AWSDateTime
  $email: String
  $id: String
  $name: String
) {
  onUpdateContact(createdAt: $createdAt, email: $email, id: $id, name: $name) {
    createdAt
    email
    id
    message
    name
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateContactSubscriptionVariables,
  APITypes.OnUpdateContactSubscription
>;
