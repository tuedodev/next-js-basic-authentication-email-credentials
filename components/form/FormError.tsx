'use client';

import { useForm } from '../context/FormProvider';

const FormError = () => {
	const { error } = useForm();
	return (
		<div>
			<p className="text-red-500 text-sm">{error?.formErrors && error.formErrors[0]}</p>
		</div>
	);
};

export default FormError;
