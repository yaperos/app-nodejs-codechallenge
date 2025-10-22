#!/usr/bin/env node

import axios from 'axios';

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

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

    console.log('✅ Create Transaction Test:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.data?.createTransaction) {
      return response.data.data.createTransaction.transactionExternalId;
    }
  } catch (error) {
    console.error('❌ Create Transaction Test Failed:');
    console.error(error.response?.data || error.message);
  }
}

async function testGetTransaction(transactionExternalId: string) {
  const query = `
    query {
      getTransaction(transactionExternalId: "${transactionExternalId}") {
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
      query: query,
    });

    console.log('\n✅ Get Transaction Test:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Get Transaction Test Failed:');
    console.error(error.response?.data || error.message);
  }
}

async function testAntiFraudApproval() {
  const mutation = `
    mutation {
      createTransaction(input: {
        accountExternalIdDebit: "550e8400-e29b-41d4-a716-446655440000"
        accountExternalIdCredit: "550e8400-e29b-41d4-a716-446655440001"
        tranferTypeId: 1
        value: 500
      }) {
        transactionExternalId
        transactionStatus {
          name
        }
        value
      }
    }
  `;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: mutation,
    });

    console.log('\n✅ Anti-Fraud Approval Test (Initial):');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.data?.createTransaction) {
      return response.data.data.createTransaction.transactionExternalId;
    }
  } catch (error) {
    console.error('❌ Anti-Fraud Approval Test Failed:');
    console.error(error.response?.data || error.message);
  }
}

async function testAntiFraudRejection() {
  const mutation = `
    mutation {
      createTransaction(input: {
        accountExternalIdDebit: "550e8400-e29b-41d4-a716-446655440000"
        accountExternalIdCredit: "550e8400-e29b-41d4-a716-446655440001"
        tranferTypeId: 1
        value: 1500
      }) {
        transactionExternalId
        transactionStatus {
          name
        }
        value
      }
    }
  `;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: mutation,
    });

    console.log('\n✅ Anti-Fraud Rejection Test (Initial):');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.data?.createTransaction) {
      return response.data.data.createTransaction.transactionExternalId;
    }
  } catch (error) {
    console.error('❌ Anti-Fraud Rejection Test Failed:');
    console.error(error.response?.data || error.message);
  }
}

async function verifyAntiFraudStatusUpdate(transactionExternalId: string, expectedStatus: string, testName: string) {
  const query = `
    query {
      getTransaction(transactionExternalId: "${transactionExternalId}") {
        transactionExternalId
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
      query: query,
    });

    console.log(`\n✅ ${testName} (After Anti-Fraud Processing):`);
    console.log(JSON.stringify(response.data, null, 2));
    
    const actualStatus = response.data.data?.getTransaction?.transactionStatus?.name;
    if (actualStatus === expectedStatus) {
      console.log(`✅ Status correctly updated to: ${expectedStatus}`);
    } else {
      console.log(`❌ Expected status: ${expectedStatus}, but got: ${actualStatus}`);
    }
  } catch (error) {
    console.error(`❌ ${testName} Verification Failed:`);
    console.error(error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🧪 Running Yape Code Challenge Tests...\n');
  
  // Wait a bit for the application to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test basic transaction creation and retrieval
  const transactionId = await testCreateTransaction();
  
  if (transactionId) {
    // Wait for anti-fraud processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    await testGetTransaction(transactionId);
  }
  
  console.log('\n🔍 Testing Anti-Fraud Service Status Updates...\n');
  
  // Test anti-fraud approval (value <= 1000)
  const approvalTransactionId = await testAntiFraudApproval();
  if (approvalTransactionId) {
    // Wait for anti-fraud processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    await verifyAntiFraudStatusUpdate(approvalTransactionId, 'approved', 'Anti-Fraud Approval Test');
  }
  
  // Test anti-fraud rejection (value > 1000)
  const rejectionTransactionId = await testAntiFraudRejection();
  if (rejectionTransactionId) {
    // Wait for anti-fraud processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    await verifyAntiFraudStatusUpdate(rejectionTransactionId, 'rejected', 'Anti-Fraud Rejection Test');
  }
  
  console.log('\n🎉 Tests completed!');
}

runTests().catch(console.error);
