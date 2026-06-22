import { test, expect, request } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});


test('Validation of delete specialty', {
  annotation: {
    type: 'description',
    description: 'Performing API request.'
  }
}, async ({ page,request }) => {
  // Step 1: Create specialty via API, assert response status

  const createResponse = await request.post('/petclinic/api/specialties', {
    data: { name: 'api testing expert' }
  });

  expect(createResponse.status()).toBe(201);
  const specialty = await createResponse.json();
  expect(specialty.name).toBe('api testing expert');

  await page.getByRole('link', { name: 'Specialties' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByRole('row', { name: 'api testing expert' })).toBeVisible();
  await page.getByRole('row', { name: 'api testing expert' })
    .getByRole('button', { name: 'Delete' })
    .click();
  await expect(page.getByRole('row', { name: 'api testing expert' })).not.toBeVisible();
});

