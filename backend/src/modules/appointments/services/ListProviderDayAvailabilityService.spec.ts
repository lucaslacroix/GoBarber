import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('listProviderDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the hour availability from provider', async () => {
        for (let i = 8; i < 11; i++) {
            await fakeAppointmentsRepository.create({
                provider_id: 'user',
                user_id: 'user1',
                date: new Date(2020, 5, 20, i, 0, 0),
            });
        }

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 6,
            day: 20,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 11, available: true },
                { hour: 12, available: true },
            ]),
        );
    });

    it('should not be available hour before now', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user1',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: 'user1',
            date: new Date(2020, 4, 20, 16, 0, 0),
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() =>
            new Date(2020, 4, 20, 11).getTime(),
        );

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 12, available: true },
                { hour: 13, available: true },
                { hour: 15, available: false },
                { hour: 16, available: false },
            ]),
        );
    });
});
