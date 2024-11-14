import gql from 'graphql-tag';

export const ALL_EVENTS_QUERY = gql`
  query ALL_EVENTS_QUERY {
    allEvents {
      id
      name
      time
      format
      store {
        name
      }
      price
    }
  }
`;

export const CREATE_EVENT_MUTATION = gql`
  mutation CREATE_EVENT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $time: String!
    $format: String!
    $storeId: ID!
  ) {
    createEvent(
      data: {
        name: $name
        description: $description
        price: $price
        time: $time
        format: $format
        store: { connect: { id: $storeId } }
      }
    ) {
      id
      name
    }
  }
`;

export const ALL_STORES_QUERY = gql`
  query ALL_STORES_QUERY {
    allStores {
      id
      name
    }
  }
`;

export const EVENT_DETAILS_QUERY = gql`
  query EVENT_DETAILS_QUERY($where: EventWhereUniqueInput!) {
    Event(where: $where) {
      id
      name
      time
      format
      description
      store {
        name
        adress
      }
      price
      participants {
        name
      }
    }
  }
`;
