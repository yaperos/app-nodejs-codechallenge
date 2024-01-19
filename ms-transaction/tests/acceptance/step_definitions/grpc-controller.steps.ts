import { Then } from '@cucumber/cucumber';
import * as assert from 'assert';

let _response: any;

export function setResponse(response: any) {
  _response = response;
}

Then('the grpc response code should be {int}', (code: number) => {
  assert.deepEqual(_response.code, code);
});

Then('the grpc response data should be:', (data) => {
  const _data = _response.data;
  const expectedData = JSON.parse(data);

  if ('items' in expectedData) {
    assertPaginatedData(_data, expectedData);
  } else {
    assertData(_data, expectedData);
  }
});

function assertPaginatedData(paginatedData: any, expectedData: any) {
  Object.keys(expectedData).forEach((key) => {
    if (key === 'items') {
      expectedData[key].forEach((expectedItem: any, index: number) => {
        assertData(paginatedData[key][index], expectedItem);
      });
    } else {
      assert.deepEqual(paginatedData[key], expectedData[key]);
    }
  });
}

function assertData(data: any, expectedData: any) {
  if ('createdAt' in expectedData) {
    assertAuditableData(data, expectedData);
  } else {
    assert.deepEqual(data, expectedData);
  }
}

function assertAuditableData(data: any, expectedData: any) {
  Object.keys(expectedData).forEach((key) => {
    if (key !== 'createdAt') {
      assert.deepEqual(data[key], expectedData[key]);
    } else {
      assert.ok(
        typeof data.createdAt === 'string' &&
          new Date(data.createdAt).toISOString() === data.createdAt,
      );
    }
  });
}
