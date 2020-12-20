import React, { useCallback, useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';
import getValidationsErrors from '../../utils/getValidationsErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignInFormData {
	name: string;
	email: string;
	password: string;
}

const SignUp: React.FC = () => {
	const emailInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);
	const formRef = useRef<FormHandles>(null);
	const navigation = useNavigation();

	const handleSignUp = useCallback(
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

				await api.post('/users', data);

				Alert.alert('Sucesso!', 'Cadastro realizado com sucesso');

				navigation.navigate('SignIn');
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
		[navigation],
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
							<Title>Crie sua conta</Title>
						</View>

						<Form ref={formRef} onSubmit={handleSignUp}>
							<Input
								icon="user"
								name="name"
								autoCorrect
								placeholder="Nome"
								returnKeyType="next"
								autoCapitalize="words"
								onSubmitEditing={() => {
									emailInputRef.current?.focus();
								}}
							/>
							<Input
								icon="mail"
								name="email"
								ref={emailInputRef}
								autoCorrect={false}
								placeholder="E-mail"
								returnKeyType="next"
								autoCapitalize="none"
								keyboardType="email-address"
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
								textContentType="newPassword"
								onSubmitEditing={() => {
									formRef.current?.submitForm();
								}}
							/>

							<Button
								onPress={() => formRef.current?.submitForm()}
							>
								Cadastrar
							</Button>
						</Form>
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
			<BackToSignIn onPress={() => navigation.goBack()}>
				<Icon name="arrow-left" size={20} color="#f4ede8" />
				<BackToSignInText>Voltar para logon</BackToSignInText>
			</BackToSignIn>
		</>
	);
};

export default SignUp;
