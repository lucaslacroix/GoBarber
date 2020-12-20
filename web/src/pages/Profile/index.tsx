import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiArrowLeft, FiCamera, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';

import getValidationsErrors from '../../utils/getValidationsErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
	name: string;
	email: string;
	old_password: string;
	password: string;
	password_confirmation: string;
}

const Profile: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const { addToast } = useToast();
	const history = useHistory();

	const { user, updateUser } = useAuth();

	const handleAvatarChange = useCallback(
		async (evt: ChangeEvent<HTMLInputElement>) => {
			if (evt.target.files) {
				const data = new FormData();

				data.append('avatar', evt.target.files[0]);

				const response = await api.patch('/users/avatar', data);

				updateUser(response.data);

				addToast({
					type: 'success',
					title: 'Avatar atualiado!',
				});
			}
		},
		[addToast, updateUser],
	);

	const handleSubmit = useCallback(
		async (data: ProfileFormData) => {
			try {
				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					name: Yup.string().required('Nome é obrigatório'),
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					old_password: Yup.string(),
					password: Yup.string().when('old_password', {
						is: val => !!val.length,
						then: Yup.string().required('Campo obrigatório'),
						otherwise: Yup.string(),
					}),
					password_confirmation: Yup.string()
						.when('old_password', {
							is: val => !!val.length,
							then: Yup.string().required('Campo obrigatório'),
							otherwise: Yup.string(),
						})
						.oneOf(
							[Yup.ref('password'), null],
							'As senhas precisam ser iguais',
						),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				const {
					name,
					email,
					old_password,
					password,
					password_confirmation,
				} = data;

				const formData = {
					name,
					email,
					...(old_password
						? {
								old_password,
								password,
								password_confirmation,
						  }
						: {}),
				};

				const response = await api.put('/profile', formData);

				updateUser(response.data);

				history.push('/dashboard');

				addToast({
					title: 'Sucesso',
					description: 'Perfil atualizado com sucesso',
					type: 'success',
				});
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationsErrors(err);

					formRef.current?.setErrors(errors);

					return;
				}

				addToast({
					type: 'error',
					title: 'Erro na atualização',
					description:
						'Ocorreu um erro ao atualizar os dados do usuario, cheque as credenciais',
				});
			}
		},
		[addToast, history],
	);

	return (
		<Container>
			<header>
				<div>
					<Link to="/dashboard">
						<FiArrowLeft />
					</Link>
				</div>
			</header>
			<Content>
				<Form
					ref={formRef}
					initialData={{
						name: user.name,
						email: user.email,
					}}
					onSubmit={handleSubmit}
				>
					<AvatarInput>
						<img src={user.avatar_url} alt={user.name} />
						<label htmlFor="avatar">
							<FiCamera />
							<input
								type="file"
								id="avatar"
								onChange={handleAvatarChange}
							/>
						</label>
					</AvatarInput>

					<h1>Meu Perfil</h1>

					<Input
						icon={FiUser}
						type="text"
						name="name"
						placeholder="Nome"
					/>
					<Input
						icon={FiMail}
						type="email"
						name="email"
						placeholder="E-mail"
					/>
					<Input
						containerStyle={{ marginTop: 24 }}
						icon={FiLock}
						type="password"
						name="old_password"
						placeholder="Senha atual"
					/>
					<Input
						icon={FiLock}
						type="password"
						name="password"
						placeholder="Nova senha"
					/>
					<Input
						icon={FiLock}
						type="password"
						name="password_confirmation"
						placeholder="Confirmar senha"
					/>

					<Button type="submit">Confirmar mudanças</Button>
				</Form>
			</Content>
		</Container>
	);
};

export default Profile;
