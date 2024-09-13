/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateContactInput = {
  createdAt: string,
  email: string,
  id: string,
  name: string,
};

export type Contact = {
  __typename: "Contact",
  createdAt: string,
  email: string,
  id: string,
  name: string,
};

export type DeleteContactInput = {
  id: string,
};

export type UpdateContactInput = {
  createdAt?: string | null,
  email?: string | null,
  id: string,
  name?: string | null,
};

export type TableContactFilterInput = {
  createdAt?: TableStringFilterInput | null,
  email?: TableStringFilterInput | null,
  id?: TableStringFilterInput | null,
  name?: TableStringFilterInput | null,
};

export type TableStringFilterInput = {
  attributeExists?: boolean | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ContactConnection = {
  __typename: "ContactConnection",
  items?:  Array<Contact | null > | null,
  nextToken?: string | null,
};

export type CreateContactMutationVariables = {
  input: CreateContactInput,
};

export type CreateContactMutation = {
  createContact?:  {
    __typename: "Contact",
    createdAt: string,
    email: string,
    id: string,
    name: string,
  } | null,
};

export type DeleteContactMutationVariables = {
  input: DeleteContactInput,
};

export type DeleteContactMutation = {
  deleteContact?:  {
    __typename: "Contact",
    createdAt: string,
    email: string,
    id: string,
    name: string,
  } | null,
};

export type UpdateContactMutationVariables = {
  input: UpdateContactInput,
};

export type UpdateContactMutation = {
  updateContact?:  {
    __typename: "Contact",
    createdAt: string,
    email: string,
    id: string,
    name: string,
  } | null,
};

export type GetContactQueryVariables = {
  id: string,
};

export type GetContactQuery = {
  getContact?:  {
    __typename: "Contact",
    createdAt: string,
    email: string,
    id: string,
    name: string,
  } | null,
};

export type ListContactsQueryVariables = {
  filter?: TableContactFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContactsQuery = {
  listContacts?:  {
    __typename: "ContactConnection",
    items?:  Array< {
      __typename: "Contact",
      createdAt: string,
      email: string,
      id: string,
      name: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateContactSubscriptionVariables = {
  createdAt?: string | null,
  email?: string | null,
  id?: string | null,
  name?: string | null,
};

export type OnCreateContactSubscription = {
  onCreateContact?:  {
    __typename: "Contact",
    createdAt: string,
    email: string,
    id: string,
    name: string,
  } | null,
};

export type OnDeleteContactSubscriptionVariables = {
  createdAt?: string | null,
  email?: string | null,
  id?: string | null,
  name?: string | null,
};

export type OnDeleteContactSubscription = {
  onDeleteContact?:  {
    __typename: "Contact",
    createdAt: string,
    email: string,
    id: string,
    name: string,
  } | null,
};

export type OnUpdateContactSubscriptionVariables = {
  createdAt?: string | null,
  email?: string | null,
  id?: string | null,
  name?: string | null,
};

export type OnUpdateContactSubscription = {
  onUpdateContact?:  {
    __typename: "Contact",
    createdAt: string,
    email: string,
    id: string,
    name: string,
  } | null,
};
