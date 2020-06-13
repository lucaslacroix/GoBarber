import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('showProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show user profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const showUser = await showProfile.execute({
            user_id: user.id,
        });

        expect(showUser.id).toBe(user.id);
        expect(showUser.name).toBe('John Doe');
        expect(showUser.email).toBe('johndoe@example.com');
    });

    it('should not be able to show profile unexists user', async () => {
        await expect(
            showProfile.execute({
                user_id: 'unexists-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
