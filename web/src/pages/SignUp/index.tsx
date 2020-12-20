import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useSpring } from 'react-spring';
import { useToast } from '../../hooks/toast';

import api from '../../services/api';

import getValidationsErrors from '../../utils/getValidationsErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background } from './styles';

interface SignupFormData {
	name: string;
	email: string;
	password: string;
}

const SignUp: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const { addToast } = useToast();
	const history = useHistory();

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

	const handleSubmit = useCallback(
		async (data: SignupFormData) => {
			try {
				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					name: Yup.string().required('Nome é obrigatório'),
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					password: Yup.string().min(6, 'Mínimo de 6 catactéres'),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				await api.post('/users', data);

				history.push('/');

				addToast({
					title: 'Sucesso',
					description: 'Usuário cadastrado com sucesso',
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
					title: 'Erro ao cadastrar usuário',
					description:
						'Ocorreu um erro ao fazer o cadastro, cheque as credenciais',
				});
			}
		},
		[addToast, history],
	);

	return (
		<Container>
			<Background style={animatedLeft} />
			<Content style={animatedRight}>
				<img src={logoImg} alt="GoBarber" />

				<Form ref={formRef} onSubmit={handleSubmit}>
					<h1>Faça seu cadastro</h1>

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
						icon={FiLock}
						type="password"
						name="password"
						placeholder="Senha"
					/>

					<Button type="submit">Cadastrar</Button>
				</Form>

				<Link to="/">
					<FiArrowLeft />
					Voltar para logon
				</Link>
			</Content>
		</Container>
	);
};

export default SignUp;
