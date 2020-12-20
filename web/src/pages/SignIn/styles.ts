import styled from 'styled-components';
import { shade } from 'polished';
import { animated } from 'react-spring';

import signInBackgoundImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
	height: 100vh;

	display: flex;
	align-items: stretch;
`;

export const Content = styled(animated.div)`
	display: flex;
	flex-direction: column;
	align-items: center;

	place-content: center;

	width: 100%;
	max-width: 700px;

	form {
		margin: 80px 0;
		width: 340px;
		text-align: center;

		h1 {
			margin-bottom: 24px;
		}

		> a {
			display: block;
			margin-top: 24px;

			color: #f4ede8;
			text-decoration: none;

			transition: all ease 0.2s;

			&:hover {
				color: ${shade(0.2, '#f4ede8')};
			}
		}
	}

	> a {
		display: flex;
		align-items: center;
		margin-top: 24px;

		color: #ff9000;
		text-decoration: none;

		transition: all ease 0.2s;

		&:hover {
			color: ${shade(0.2, '#ff9000')};
		}

		> svg {
			margin-right: 16px;
		}
	}
`;

export const Background = styled(animated.div)`
	flex: 1;
	background: url(${signInBackgoundImg}) no-repeat center;
	background-size: cover;
`;
