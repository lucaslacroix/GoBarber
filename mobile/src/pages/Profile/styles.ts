import styled from 'styled-components/native';

export const Container = styled.View`
	flex: 1;
	/* align-items: center; */
	justify-content: center;

	padding: 0 30px 100px;
`;

export const Title = styled.Text`
	font-size: 20px;
	color: #f4ede8;
	font-family: 'RobotoSlab-Medium';
	margin: 24px 0;
`;

export const UserAvatarButton = styled.TouchableOpacity`
	position: relative;
	z-index: 9;
`;

export const UserAvatar = styled.Image`
	width: 186px;
	height: 186px;
	border-radius: 98px;
	margin-top: 54px;

	align-self: center;
`;

export const BackButton = styled.TouchableOpacity`
	position: absolute;
	left: 24px;
	top: 54px;
	z-index: 10;
`;
