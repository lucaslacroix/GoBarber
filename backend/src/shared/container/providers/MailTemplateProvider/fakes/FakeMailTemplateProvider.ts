import IMailTemplateProvider from '../models/IMailTempleteProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
    public async parse(): Promise<string> {
        return 'mail content';
    }
}

export default FakeMailTemplateProvider;
