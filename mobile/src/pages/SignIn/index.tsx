import React, { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
	View,
	Image,
	Alert,
	Platform,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
} from 'react-native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import getValidationsErrors from '../../utils/getValidationsErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
	Title,
	Container,
	ForgotPassword,
	CreateAccountText,
	ForgotPasswordText,
	CreateAccountButton,
} from './styles';

interface SignInFormData {
	email: string;
	password: string;
}

const SignIn: React.FC = () => {
	const formRef = useRef<FormHandles>(null);
	const passwordInputRef = useRef<TextInput>(null);
	const navigation = useNavigation();

	const { signIn } = useAuth();

	const handleSignIn = useCallback(
		async (data: SignInFormData) => {
			try {
				formRef.current?.setErrors({});

				const schema = Yup.object().shape({
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					password: Yup.string().required('Digite sua senha'),
				});

				await schema.validate(data, {
					abortEarly: false,
				});

				await signIn({
					email: data.email,
					password: data.password,
				});
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationsErrors(err);

					formRef.current?.setErrors(errors);

					return;
				}

				Alert.alert(
					'Erro na autenticação',
					'Ocorreu um erro ao fazer login, cheque as credenciais',
				);
			}
		},
		[signIn],
	);

	return (
		<>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				enabled
			>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flex: 1 }}
				>
					<Container>
						<Image source={logoImg} />

						<View>
							<Title>Faça seu logon</Title>
						</View>
						<Form ref={formRef} onSubmit={handleSignIn}>
							<Input
								autoCorrect={false}
								autoCapitalize="none"
								keyboardType="email-address"
								name="email"
								icon="mail"
								placeholder="E-mail"
								returnKeyType="next"
								onSubmitEditing={() => {
									passwordInputRef.current?.focus();
								}}
							/>
							<Input
								icon="lock"
								name="password"
								secureTextEntry
								placeholder="Senha"
								returnKeyType="send"
								ref={passwordInputRef}
								onSubmitEditing={() => {
									formRef.current?.submitForm();
								}}
							/>

							<Button
								onPress={() => {
									formRef.current?.submitForm();
								}}
							>
								Entrar
							</Button>
						</Form>
						<ForgotPassword onPress={() => console.log('Esqueceu')}>
							<ForgotPasswordText>
								Esqueci minha senha
							</ForgotPasswordText>
						</ForgotPassword>
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
			<CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
				<Icon name="log-in" size={20} color="#ff9000" />
				<CreateAccountText>Criar uma conta</CreateAccountText>
			</CreateAccountButton>
		</>
	);
};

export default SignIn;
