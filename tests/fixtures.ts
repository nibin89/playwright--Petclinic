import { test as base, expect } from '@playwright/test';

const API_URL = 'https://petclinic-api.bondaracademy.com/petclinic';

type OwnerFixture = {
    owner: {
        id: number;
        firstName: string;
        lastName: string;
        petName: string;
        visitDescription: string;
    };
};

export const test = base.extend<OwnerFixture>({
    owner: async ({ request }, use) => {

        // Pre-cleanup: delete any leftover Fixture Owners that failed to delete in the previous runs
        const existingRes = await request.get(`${API_URL}/api/owners?lastName=Owner`);
        const responseText = await existingRes.text();
        if (responseText) {
            const existingOwners = JSON.parse(responseText);
            for (const owner of existingOwners) {
                if (owner.firstName === 'Fixture') {
                    await request.delete(`${API_URL}/api/owners/${owner.id}`);
                }
            }
        }

        // Step 1: Create owner
        const ownerRes = await request.post(`${API_URL}/api/owners`, {
            data: {
                firstName: 'Fixture',
                lastName: 'Owner',
                address: '123 Test St',
                city: 'Testville',
                telephone: '1234567890',
            },
        });
        expect(ownerRes.status()).toBe(201);
        const ownerData = await ownerRes.json();

        // Step 2: Create pet
        const petRes = await request.post(`${API_URL}/api/owners/${ownerData.id}/pets`, {
            data: {
                id: null,
                name: 'FixturePet',
                birthDate: '2025-06-25',
                type: { name: 'cat', id: 3079 },
                owner: ownerData,
                pettype: 'cat',
            },
        });
        expect(petRes.status()).toBe(201);
        const petData = await petRes.json();

        // Step 3: Create visit
        const visitRes = await request.post(
            `${API_URL}/api/owners/${ownerData.id}/pets/${petData.id}/visits`,
            {
                data: {
                    id: null,
                    date: '2026-06-07',
                    description: 'Fixture visit',
                    pet: petData,
                },
            }
        );
        expect(visitRes.status()).toBe(201);

        // Hand control to the test
        await use({
            id: ownerData.id,
            firstName: 'Fixture',
            lastName: 'Owner',
            petName: 'FixturePet',
            visitDescription: 'Fixture visit',
        });

        // Teardown: delete owner
        await request.delete(`${API_URL}/api/owners/${ownerData.id}`);
    },
});

export { expect } from '@playwright/test';