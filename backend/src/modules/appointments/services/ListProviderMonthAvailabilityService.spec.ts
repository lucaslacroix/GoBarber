import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the month availability from provider', async () => {
        for (let i = 8; i < 18; i++) {
            await fakeAppointmentsRepository.create({
                provider_id: 'user',
                user_id: 'user1',
                date: new Date(2020, 5, 20, i, 0, 0),
            });
            await fakeAppointmentsRepository.create({
                provider_id: 'user',
                user_id: 'user1',
                date: new Date(2020, 5, 21, i, 0, 0),
            });
        }

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user1',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 6,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: false },
                { day: 22, available: true },
            ]),
        );
    });
});
