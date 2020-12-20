import React, { useRef, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useSpring } from 'react-spring';

import getValidationsErrors from '../../utils/getValidationsErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormData {
	password_confirmation: string;
	password: string;
}

const ResetPassword: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const history = useHistory();
	const location = useLocation();

	const animatedLeft = useSpring({
		from: {
			opacity: 0,
			transform: 'translateX(-100%)',
		},
		to: {
			opacity: 1,
			transform: 'translateX(0)',
		},
	});

	const animatedRight = useSpring({
		from: {
			opacity: 0,
			transform: 'translateX(100%)',
		},
		to: {
			opacity: 1,
			transform: 'translateX(0)',
		},
	});

	const { addToast } = useToast();

	const handleSubmit = useCallback(
		async (data: ResetPasswordFormData) => {
			try {
				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					password: Yup.string().required('Nova senha é obrigatória'),
					password_confirmation: Yup.string().oneOf(
						[Yup.ref('password'), null],
						'As senhas precisam ser iguais',
					),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				const { password, password_confirmation } = data;
				const token = location.search.replace('?token=', '');

				if (!token) {
					throw new Error();
				}

				await api.post('/password/reset', {
					password,
					password_confirmation,
					token,
				});

				history.push('/');
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationsErrors(err);

					formRef.current?.setErrors(errors);

					return;
				}

				addToast({
					type: 'error',
					title: 'Erro ao resetar senha',
					description: 'Ocorreu um erro ao resetar sua senha.',
				});
			}
		},
		[addToast, history, location],
	);

	return (
		<Container>
			<Content style={animatedLeft}>
				<img src={logoImg} alt="GoBarber" />

				<Form ref={formRef} onSubmit={handleSubmit}>
					<h1>Resetar senha</h1>

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
						placeholder="Confirme a nova senha"
					/>

					<Button type="submit">Alterar Senha</Button>
				</Form>

				<Link to="/">
					<FiLogIn />
					Voltar ao login
				</Link>
			</Content>
			<Background style={animatedRight} />
		</Container>
	);
};

export default ResetPassword;
