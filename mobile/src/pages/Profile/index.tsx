import React, { useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
	Alert,
	Platform,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
} from 'react-native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import ImagePicker from 'react-native-image-picker';

import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';
import getValidationsErrors from '../../utils/getValidationsErrors';

import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
	Container,
	Title,
	UserAvatarButton,
	UserAvatar,
	BackButton,
} from './styles';

interface ProfileFormData {
	name: string;
	email: string;
	password: string;
	old_password: string;
	password_confirmation: string;
}

const Profile: React.FC = () => {
	const { user, updateUser } = useAuth();

	const formRef = useRef<FormHandles>(null);
	const emailInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);
	const oldPasswordInputRef = useRef<TextInput>(null);
	const confirmPasswordInputRef = useRef<TextInput>(null);

	const { navigate, goBack } = useNavigation();

	const handleUpdateAvatar = useCallback(() => {
		ImagePicker.showImagePicker(
			{
				title: 'Selecione um avatar',
				cancelButtonTitle: 'Cancelar',
				takePhotoButtonTitle: 'Usar camera',
				chooseFromLibraryButtonTitle: 'Escolher da galeria',
			},
			response => {
				if (response.didCancel) {
					return;
				}

				if (response.error) {
					Alert.alert(
						'Erro!',
						'Ocorreu um erro ao atualizar seu avatar, tente novamente',
					);

					return;
				}

				const source = {
					uri: response.uri,
					type: response.type,
					name: response.fileName,
				};

				const data = new FormData();

				data.append('avatar', source);

				console.log(data);

				api.patch('/users/avatar', data)
					.then(apiResponse => {
						updateUser(apiResponse.data);
					})
					.catch(err => {
						console.log(err);
					});
			},
		);
	}, [updateUser]);

	const handleProfile = useCallback(
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

				Alert.alert('Sucesso!', 'Perfil atualizado com sucesso');

				navigate('Dashboard');
			} catch (err) {
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationsErrors(err);

					formRef.current?.setErrors(errors);

					return;
				}

				Alert.alert(
					'Erro!',
					'Ocorreu um erro ao fazer a atualização do seu perfil, cheque as credenciais',
				);
			}
		},
		[navigate, updateUser],
	);

	const handleGoBack = useCallback(() => {
		goBack();
	}, [goBack]);

	return (
		<>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				enabled
			>
				<ScrollView keyboardShouldPersistTaps="handled">
					<Container>
						<BackButton onPress={handleGoBack}>
							<Icon
								name="chevron-left"
								size={24}
								color="#999591"
							/>
						</BackButton>

						<UserAvatarButton onPress={handleUpdateAvatar}>
							<UserAvatar source={{ uri: user.avatar_url }} />
						</UserAvatarButton>

						<Title>Meu perfil</Title>

						<Form
							initialData={user}
							ref={formRef}
							onSubmit={handleProfile}
						>
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
									oldPasswordInputRef.current?.focus();
								}}
							/>
							<Input
								icon="lock"
								name="old_password"
								ref={oldPasswordInputRef}
								secureTextEntry
								containerStyle={{ marginTop: 16 }}
								placeholder="Senha atual"
								returnKeyType="next"
								textContentType="newPassword"
								onSubmitEditing={() => {
									passwordInputRef.current?.focus();
								}}
							/>
							<Input
								icon="lock"
								name="password"
								ref={passwordInputRef}
								secureTextEntry
								placeholder="Nova senha"
								returnKeyType="next"
								textContentType="newPassword"
								onSubmitEditing={() => {
									confirmPasswordInputRef.current?.focus();
								}}
							/>
							<Input
								icon="lock"
								name="password_confirmation"
								ref={confirmPasswordInputRef}
								secureTextEntry
								placeholder="Confirmar senha"
								returnKeyType="send"
								textContentType="newPassword"
								onSubmitEditing={() => {
									formRef.current?.submitForm();
								}}
							/>

							<Button
								onPress={() => formRef.current?.submitForm()}
							>
								Confirmar mudanças
							</Button>
						</Form>
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
		</>
	);
};

export default Profile;
