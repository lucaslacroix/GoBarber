import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
	> header {
		display: flex;
		align-items: center;

		height: 144px;

		background: #28262e;

		> div {
			width: 100%;
			max-width: 1120px;
			margin: 0 auto;

			svg {
				color: #999591;
				width: 25px;
				height: 25px;
			}
		}
	}
`;

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	place-content: center;

	width: 100%;

	margin: -176px auto 0;

	form {
		display: flex;
		flex-direction: column;

		margin: 80px 0;
		width: 340px;
		text-align: center;

		h1 {
			margin-bottom: 24px;
			font-size: 20px;
			text-align: left;
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

		input[name='old_password'] {
			margin-top: 24px;
		}
	}
`;

export const AvatarInput = styled.div`
	margin-bottom: 32px;

	position: relative;

	align-self: center;

	img {
		width: 186px;
		height: 186px;

		border-radius: 50%;
	}

	label {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 48px;
		height: 48px;

		position: absolute;
		bottom: 0;
		right: 0;

		background: #ff9000;
		border: 0;
		border-radius: 50%;

		cursor: pointer;

		transition: all 0.2s ease;

		input {
			display: none;
		}

		svg {
			width: 20px;
			height: 20px;

			color: #312e38;

			transition: all 0.2s ease;
		}

		&:hover {
			background: #312e38;

			svg {
				color: #ff9000;
			}
		}
	}
`;
