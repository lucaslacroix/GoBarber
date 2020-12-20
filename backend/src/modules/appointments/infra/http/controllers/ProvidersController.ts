import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

class ProvidersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;

        const createAppointment = container.resolve(ListProvidersService);

        const appointment = await createAppointment.execute({
            user_id,
        });

        return response.json(classToClass(appointment));
    }
}

export default new ProvidersController();
