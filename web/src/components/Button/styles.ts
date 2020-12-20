import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
	background: #ff9000;
	height: 56px;
	border-radius: 10px;
	border: none;

	padding: 0 16px;
	margin-top: 16px;

	color: #312e38;
	font-weight: 500;

	width: 100%;

	transition: all ease 0.2s;

	&:hover {
		background: ${shade(0.2, '#ff9000')};
	}
`;
