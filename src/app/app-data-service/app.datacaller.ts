import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

async function getDataFromService() {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
  });

  const GET_ACCOUNTS = gql`
    query GetAccounts {
      accounts {
        account_cd
        account_nm
      }
    }
  `;

  try {
    const { data } = await client.query({ query: GET_ACCOUNTS });
    console.log(data.accounts);
  } catch (error) {
    console.error('Error:', error);
  }
}

getDataFromService();