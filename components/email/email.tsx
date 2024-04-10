import { EMAIL_PASSWORD_RESET_LINK_VALID_SECONDS, EMAIL_VERIFICATION_LINK_VALID_SECONDS } from '@/lib/constants';
import { Resend } from 'resend';
import BodyConclusion from './BodyConclusion';
import BodyMagicLink from './BodyMagicLink';
import BodyMessage from './BodyMessage';
import BodyTitle from './BodyTitle';

export type EmailVariant = 'verify' | 'forgotPassword';

export type EmailProps = {
	variant: EmailVariant;
	email: string;
	from?: string;
	firstname: string;
	lastname: string;
	magicLink: string;
};

const EMAIL_MESSAGES: Record<EmailVariant, any> = {
	verify: {
		subject: 'Verify your email address  by clicking the link below',
		message: [
			'Please verify your email address by clicking on below link.',
			'If you did not create an account, please ignore this email.',
		],
		validityInSeconds: EMAIL_VERIFICATION_LINK_VALID_SECONDS,
	},
	forgotPassword: {
		subject: 'Reset your password by clicking the link below',
		message: [
			'Please click on the link in due time and set a new password.',
			'If you did not request a password reset, please ignore this email.',
		],
		validityInSeconds: EMAIL_PASSWORD_RESET_LINK_VALID_SECONDS,
	},
};

export async function sendTransactionalEmail(props: EmailProps): Promise<boolean> {
	const resend = new Resend(process.env.RESEND_API_KEY);
	const emailTemplate = EMAIL_MESSAGES[props.variant];

	return new Promise(async (resolve, _) => {
		try {
			const { data, error } = await resend.emails.send({
				from: props.from ? props.from : 'Acme <onboarding@resend.dev>',
				to: [props.email],
				subject: emailTemplate.subject,
				react: (
					<>
						<BodyTitle firstname={props.firstname} lastname={props.lastname} />
						<BodyMessage message={emailTemplate.message} />
						<BodyMagicLink magicLink={props.magicLink} validityInSeconds={emailTemplate.validityInSeconds} />
						<BodyConclusion />
					</>
				),
			});
			if (error) {
				console.log(error);
				resolve(false);
			}
			resolve(true);
		} catch (err) {
			console.log(err);
			resolve(false);
		}
	});
}
