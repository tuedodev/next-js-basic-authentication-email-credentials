'use client';

import React, { forwardRef } from 'react';
import { useForm } from '../context/FormProvider';

type Props = {
	name: string;
	label: string;
	autoComplete?: string;
};
const InputField = forwardRef(function PasswordField(
	{ name, autoComplete, label }: Props,
	ref: React.ForwardedRef<HTMLInputElement>
) {
	const { error, onChangeHandler } = useForm();
	return (
		<div className="grid grid-cols-1 grid-rows-[auto_1fr_minmax(1.25rem,auto)]">
			<label className="text-base" htmlFor={name}>
				{label}
			</label>
			<input type="text" name={name} id={name} ref={ref} autoComplete={autoComplete} onChange={onChangeHandler} />
			<p className="text-red-500 text-sm">{error?.fieldErrors[name] ? error?.fieldErrors[name] : ''}</p>
		</div>
	);
});

export default InputField;
