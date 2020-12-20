import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';

import { Platform, Alert } from 'react-native';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
	Header,
	Content,
	Container,
	UserAvatar,
	BackButton,
	HeaderTitle,
	ProvidersList,
	ProvidersListContainer,
	ProviderContainer,
	ProviderAvatar,
	ProviderName,
	Calendar,
	Title,
	OpenDatePickerButton,
	OpenDatePickerButtonText,
	Schedule,
	Section,
	SectionTitle,
	SectionContent,
	Hour,
	HourText,
	CreatedAppointmentButton,
	CreatedAppointmentButtonText,
} from './styles';

interface RouteParams {
	providerId: string;
}

export interface Provider {
	id: string;
	name: string;
	avatar_url: string;
}

interface AvailabilityItem {
	hour: number;
	available: boolean;
}

const CreateAppointment: React.FC = () => {
	const route = useRoute();
	const { providerId } = route.params as RouteParams;

	const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
	const [providers, setProviders] = useState<Provider[]>([]);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedHour, setSelectedHour] = useState(0);
	const [selectedProvider, setSelectedProvider] = useState(providerId);

	const { user } = useAuth();
	const { goBack, navigate } = useNavigation();

	useEffect(() => {
		api.get('/providers').then(response => {
			setProviders(response.data);
		});
	}, []);

	useEffect(() => {
		api.get(`/providers/${selectedProvider}/day-availability`, {
			params: {
				year: selectedDate.getFullYear(),
				month: selectedDate.getMonth() + 1,
				day: selectedDate.getDate(),
			},
		}).then(response => {
			setAvailability(response.data);
		});
	}, [selectedDate, selectedProvider]);

	const navigateBack = useCallback(() => {
		goBack();
	}, [goBack]);

	const handleSelectProvider = useCallback(
		(id: string) => {
			setSelectedProvider(id);
		},
		[setSelectedProvider],
	);

	const handleToggleDatePicker = useCallback(
		() => setShowDatePicker(state => !state),
		[],
	);

	const handleDateChanged = useCallback(
		(event: any, date: Date | undefined) => {
			if (Platform.OS === 'android') {
				setShowDatePicker(false);
			}

			if (date) {
				console.log(date);
				setSelectedDate(date);
			}
		},
		[],
	);

	const morningAvailability = useMemo(
		() =>
			availability
				.filter(({ hour }) => hour < 12)
				.map(({ hour, available }) => ({
					hour,
					available,
					hourFormatted: format(new Date().setHours(hour), 'HH:00'),
				})),
		[availability],
	);

	const afternoonAvailability = useMemo(
		() =>
			availability
				.filter(({ hour }) => hour >= 12)
				.map(({ hour, available }) => ({
					hour,
					available,
					hourFormatted: format(new Date().setHours(hour), 'HH:00'),
				})),
		[availability],
	);

	const handleSelectHour = useCallback(
		(hour: number) => {
			setSelectedHour(hour);
		},
		[setSelectedHour],
	);

	const handleCreateAppointment = useCallback(async () => {
		try {
			const date = new Date(selectedDate);

			date.setHours(selectedHour);
			date.setMinutes(0);

			console.log(date);

			await api.post('/appointments', {
				provider_id: selectedProvider,
				date,
			});

			navigate('AppointmentCreated', { date: date.getTime() });
		} catch (err) {
			console.log(err);

			Alert.alert(
				'Erro ao criar agendamento!',
				'Ocorreu um erro ao tentar criar o agendamento, tente novamente',
			);
		}
	}, [selectedDate, selectedHour, selectedProvider, navigate]);

	return (
		<Container>
			<Header>
				<BackButton onPress={navigateBack}>
					<Icon name="chevron-left" size={24} color="#999591" />
				</BackButton>

				<HeaderTitle>Cabeleireiros</HeaderTitle>

				<UserAvatar source={{ uri: user.avatar_url }} />
			</Header>

			<Content>
				<ProvidersListContainer>
					<ProvidersList
						horizontal
						showsHorizontalScrollIndicator={false}
						data={providers}
						keyExtractor={provider => provider.id}
						renderItem={({ item: provider }) => (
							<ProviderContainer
								onPress={() => {
									handleSelectProvider(provider.id);
								}}
								selected={provider.id === selectedProvider}
							>
								<ProviderAvatar
									source={{ uri: provider.avatar_url }}
								/>
								<ProviderName
									selected={provider.id === selectedProvider}
								>
									{provider.name}
								</ProviderName>
							</ProviderContainer>
						)}
					/>
				</ProvidersListContainer>
				<Calendar>
					<Title>Escolha a data</Title>

					<OpenDatePickerButton onPress={handleToggleDatePicker}>
						<OpenDatePickerButtonText>
							{selectedDate.toLocaleDateString('pt-BR')}
						</OpenDatePickerButtonText>
					</OpenDatePickerButton>

					{showDatePicker && (
						<DateTimePicker
							mode="date"
							display="calendar"
							onChange={handleDateChanged}
							value={selectedDate}
						/>
					)}
				</Calendar>

				<Schedule>
					<Title>Escolha um horário</Title>

					<Section>
						<SectionTitle>Manhã</SectionTitle>

						<SectionContent>
							{morningAvailability.map(
								({ hourFormatted, hour, available }) => (
									<Hour
										enabled={available}
										selected={selectedHour === hour}
										onPress={() => handleSelectHour(hour)}
										available={available}
										key={hourFormatted}
									>
										<HourText
											selected={selectedHour === hour}
										>
											{hourFormatted}
										</HourText>
									</Hour>
								),
							)}
						</SectionContent>
					</Section>

					<Section>
						<SectionTitle>Tarde</SectionTitle>

						<SectionContent>
							{afternoonAvailability.map(
								({ hourFormatted, hour, available }) => (
									<Hour
										enabled={available}
										selected={selectedHour === hour}
										onPress={() => handleSelectHour(hour)}
										available={available}
										key={hourFormatted}
									>
										<HourText
											selected={selectedHour === hour}
										>
											{hourFormatted}
										</HourText>
									</Hour>
								),
							)}
						</SectionContent>
					</Section>
				</Schedule>

				<CreatedAppointmentButton onPress={handleCreateAppointment}>
					<CreatedAppointmentButtonText>
						Agendar
					</CreatedAppointmentButtonText>
				</CreatedAppointmentButton>
			</Content>
		</Container>
	);
};

export default CreateAppointment;
