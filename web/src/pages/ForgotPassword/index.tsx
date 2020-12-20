import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
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

interface ForgotPasswordFormData {
	email: string;
	password: string;
}

const ForgotPassword: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const formRef = useRef<FormHandles>(null);

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
		async (data: ForgotPasswordFormData) => {
			try {
				setLoading(true);

				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				await api.post('/password/forgot', {
					email: data.email,
				});

				addToast({
					type: 'success',
					title: 'E-mail de recuperação enviado',
					description: 'Cheque seu e-mail para recuperar sua senha',
				});
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationsErrors(err);

					formRef.current?.setErrors(errors);

					return;
				}

				addToast({
					type: 'error',
					title: 'Erro na recuperação de senha',
					description:
						'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente',
				});
			} finally {
				setLoading(false);
			}
		},
		[addToast],
	);

	return (
		<Container>
			<Content style={animatedLeft}>
				<img src={logoImg} alt="GoBarber" />

				<Form ref={formRef} onSubmit={handleSubmit}>
					<h1>Recuperação de senha</h1>

					<Input
						icon={FiMail}
						type="text"
						name="email"
						placeholder="E-mail"
					/>

					<Button loading={loading} type="submit">
						Recuperar
					</Button>
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

export default ForgotPassword;
