import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        const appointmentDate = new Date(2020, 4, 10, 13);

        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: appointmentDate,
            provider_id: '1234548987',
            user_id: 'user',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1234548987');
    });

    it('should not be able to create two appointment on the same time', async () => {
        const appointmentDate = new Date(2020, 4, 10, 15);

        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 10, 12).getTime(),
        );

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '1234548987',
            user_id: 'user',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '1234548987',
                user_id: 'user',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        const appointmentDate = new Date(2020, 4, 10, 11);

        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 10, 12).getTime(),
        );

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '1234548987',
                user_id: 'user1',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user and provider', async () => {
        const appointmentDate = new Date(2020, 4, 10, 13);

        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 10, 12).getTime(),
        );

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: 'user1',
                user_id: 'user1',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8 hours and after the 17 hours', async () => {
        const appointmentDate1 = new Date(2020, 4, 10, 7);
        const appointmentDate2 = new Date(2020, 4, 10, 18);

        jest.spyOn(Date, 'now').mockImplementation(() =>
            new Date(2020, 4, 10, 12).getTime(),
        );

        await expect(
            createAppointment.execute({
                date: appointmentDate1,
                provider_id: '123456',
                user_id: 'user1',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: appointmentDate2,
                provider_id: '123456',
                user_id: 'user1',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
