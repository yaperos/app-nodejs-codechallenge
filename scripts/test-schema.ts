#!/usr/bin/env node

import axios from 'axios';

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

type IntrospectionResponse = {
  id: string;
  name: string;
  kind: string;
};

async function testSchemaIntrospection() {
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        types {
          name
          kind
        }
      }
    }
  `;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: introspectionQuery,
    });

    console.log('✅ Schema Introspection Test:');
    const types = response.data.data.__schema.types;
    const transactionTypes = types.filter(
      (type: IntrospectionResponse) =>
        type.name.includes('Transaction') ||
        type.name.includes('TransactionType') ||
        type.name.includes('TransactionStatus')
    );

    console.log('Transaction-related types found:');
    transactionTypes.forEach((type: IntrospectionResponse) => {
      console.log(`  - ${type.name} (${type.kind})`);
    });

    // Check for duplicates
    const typeNames = transactionTypes.map(
      (type: IntrospectionResponse) => type.name
    );
    const duplicates = typeNames.filter(
      (name: string, index: number) => typeNames.indexOf(name) !== index
    );

    if (duplicates.length > 0) {
      console.log('❌ Duplicate types found:', duplicates);
    } else {
      console.log('✅ No duplicate types found');
    }
  } catch (error) {
    console.error('❌ Schema Introspection Test Failed:');
    console.error(error.response?.data || error.message);
  }
}

async function testCreateTransaction() {
  const mutation = `
    mutation {
      createTransaction(input: {
        accountExternalIdDebit: "550e8400-e29b-41d4-a716-446655440000"
        accountExternalIdCredit: "550e8400-e29b-41d4-a716-446655440001"
        tranferTypeId: 1
        value: 500
      }) {
        transactionExternalId
        transactionType {
          name
        }
        transactionStatus {
          name
        }
        value
        createdAt
      }
    }
  `;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: mutation,
    });

    console.log('\n✅ Create Transaction Test:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.data?.createTransaction) {
      return response.data.data.createTransaction.transactionExternalId;
    }
  } catch (error) {
    console.error('❌ Create Transaction Test Failed:');
    console.error(error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing GraphQL Schema Fix...\n');

  // Wait a bit for the application to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));

  await testSchemaIntrospection();
  await testCreateTransaction();

  console.log('\n🎉 Schema tests completed!');
}

runTests().catch(console.error);
