'use client';

import React, { forwardRef } from 'react';
import { useForm } from '../context/FormProvider';
import { twMerge } from 'tailwind-merge';

type Props = {
	name: string;
	label: string;
	autoComplete?: string;
	options: { id: number; name: string }[];
	className?: string;
};
const SelectFieldControlled = forwardRef(function PasswordField(
	{ name, label, options, className }: Props,
	ref: React.ForwardedRef<HTMLSelectElement>
) {
	const { error, onChangeHandler, values } = useForm();

	return (
		<div className={twMerge('grid grid-cols-1 grid-rows-[auto_1fr_auto]', className)}>
			<label className="text-base font-bold" htmlFor={name}>
				{label}
			</label>
			<select id={name} name={name} onChange={onChangeHandler} defaultValue={values?.[name]} ref={ref}>
				{options.map((option) => (
					<option key={option.id} value={option.name}>
						{option.name}
					</option>
				))}
			</select>
			<p className="text-red-500 text-sm">{error?.fieldErrors[name] ? error?.fieldErrors[name] : ''}</p>
		</div>
	);
});

export default SelectFieldControlled;
