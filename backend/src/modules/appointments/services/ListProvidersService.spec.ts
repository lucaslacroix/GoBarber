import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProvidersService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let listProvider: ListProviderService;

describe('listProvider', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvider = new ListProviderService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list all providers', async () => {
        const johnUno = await fakeUsersRepository.create({
            name: 'John Uno',
            email: 'johnuno@example.com',
            password: '123456',
        });
        const johnDoe = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const johnTre = await fakeUsersRepository.create({
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123456',
        });
        const loggedUser = await fakeUsersRepository.create({
            name: 'John Qua',
            email: 'johnqua@example.com',
            password: '123456',
        });

        const providers = await listProvider.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([johnUno, johnDoe, johnTre]);
    });
});
