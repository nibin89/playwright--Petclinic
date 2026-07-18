import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { PetTypesPage } from '../pages/PetTypesPage';
import { NewPetTypePage } from '../pages/NewPetTypePage';
import { EditPetTypePage } from '../pages/EditPetTypePage';
import { VeterinariansPage } from '../pages/VeterinariansPage';
import { EditVeterinarianPage } from '../pages/EditveterinariansPage';
import { OwnersPage } from '../pages/OwnersPage';
import { OwnerInformationPage } from '../pages/OwnerInformationPage';
import { EditPetPage } from '../pages/EditPetPage';

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

type PageObjectFixtures = {
    homePage: HomePage;
    petTypesPage: PetTypesPage;
    newPetTypePage: NewPetTypePage;
    editPetTypePage: EditPetTypePage;
    veterinariansPage: VeterinariansPage;
    editVeterinarianPage: EditVeterinarianPage;
    ownersPage: OwnersPage;
    ownerInformationPage: OwnerInformationPage;
    editPetPage: EditPetPage;
};

export const test = base.extend<OwnerFixture & PageObjectFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    petTypesPage: async ({ page }, use) => {
        await use(new PetTypesPage(page));
    },

    newPetTypePage: async ({ page }, use) => {
        await use(new NewPetTypePage(page));
    },

    editPetTypePage: async ({ page }, use) => {
        await use(new EditPetTypePage(page));
    },

    veterinariansPage: async ({ page }, use) => {
        await use(new VeterinariansPage(page));
    },

    editVeterinarianPage: async ({ page }, use) => {
        await use(new EditVeterinarianPage(page));
    },

    ownersPage: async ({ page }, use) => {
        await use(new OwnersPage(page));
    },

    ownerInformationPage: async ({ page }, use) => {
        await use(new OwnerInformationPage(page));
    },

    editPetPage: async ({ page }, use) => {
        await use(new EditPetPage(page));
    },

    owner: async ({ request }, use) => {

        // Pre-cleanup: delete any leftover Fixture Owners that failed to delete in the previous runs
        const existingResponse = await request.get(`${API_URL}/api/owners?lastName=Owner`);
        const existingresponseText = await existingResponse.text();
        if (existingresponseText) {
            const existingOwners = JSON.parse(existingresponseText);
            for (const owner of existingOwners) {
                if (owner.firstName === 'Fixture') {
                    await request.delete(`${API_URL}/api/owners/${owner.id}`);
                }
            }
        }

        // Step 1: Create owner
        const createOwnerResponse = await request.post(`${API_URL}/api/owners`, {
            data: {
                firstName: 'Fixture',
                lastName: 'Owner',
                address: '123 Test St',
                city: 'Testville',
                telephone: '1234567890',
            },
        });
        expect(createOwnerResponse.status()).toBe(201);
        const ownerDataJson = await createOwnerResponse.json();

        // Step 2: Create pet
        const createPetResponse = await request.post(`${API_URL}/api/owners/${ownerDataJson.id}/pets`, {
            data: {
                id: null,
                name: 'FixturePet',
                birthDate: '2025-06-25',
                type: { name: 'cat', id: 3079 },
                owner: ownerDataJson,
                pettype: 'cat',
            },
        });
        expect(createPetResponse.status()).toBe(201);
        const petDataResponseJson = await createPetResponse.json();

        // Step 3: Create visit
        const createVisitResponse = await request.post(
            `${API_URL}/api/owners/${ownerDataJson.id}/pets/${petDataResponseJson.id}/visits`,
            {
                data: {
                    id: null,
                    date: '2026-06-07',
                    description: 'Fixture visit',
                    pet: petDataResponseJson,
                },
            }
        );
        expect(createVisitResponse.status()).toBe(201);

        // Hand control to the test
        await use({
            id: ownerDataJson.id,
            firstName: 'Fixture',
            lastName: 'Owner',
            petName: 'FixturePet',
            visitDescription: 'Fixture visit',
        });

        // Teardown: delete owner
        await request.delete(`${API_URL}/api/owners/${ownerDataJson.id}`);
    },
});

export { expect } from '@playwright/test';