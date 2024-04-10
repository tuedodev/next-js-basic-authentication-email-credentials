'use client';

import { INITIAL_ERROR_STATE } from '@/lib/constants';
import { validatateRawFormDataAgainstSchema } from '@/lib/validation';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { ZodSchema, ZodType, z } from 'zod';
import { useModal } from './ModalProvider';
import { ModalContentProps } from '../layout/ModalBuilder';
import { isEqualWithCurrentFormData } from '@/lib/utils';

type FormContextType = {
	onChangeHandler: (event: React.FormEvent<HTMLElement>) => void;
	error: z.inferFlattenedErrors<ZodType<any, any>> | undefined;
	values: Record<string, any>;
	isChanged: boolean;
};
type Props = {
	children: React.ReactNode;
	dispatcher: (previousState: any, formData: FormData) => Promise<z.inferFlattenedErrors<ZodType<any, any>>>;
	schema: ZodSchema;
	passwordRefs?: React.MutableRefObject<HTMLInputElement[]>;
	initValues: Record<string, any>;
	modal?: ModalContentProps;
};
const FormContext = createContext<FormContextType | null>(null);

const FormProvider: React.FC<Props> = ({ children, dispatcher, schema, passwordRefs, initValues, modal }) => {
	const [error, setError] = useState<z.inferFlattenedErrors<ZodType<any, any>>>(INITIAL_ERROR_STATE);
	const [serverValidation, formAction] = useFormState(dispatcher, null);
	const [values, setValues] = useState(initValues);
	const [isChanged, setIsChanged] = useState<boolean>(false);
	const ref = useRef<HTMLFormElement>(null);
	const { setContent, setShowModal, showModal } = useModal();

	useEffect(() => {
		const formData = ref.current ? new FormData(ref.current) : new FormData();
		setIsChanged((_) => !isEqualWithCurrentFormData(initValues, formData));
	}, [values, initValues, setIsChanged]);

	useEffect(() => {
		if (serverValidation) {
			if (Object.keys(serverValidation.fieldErrors).length > 0 || serverValidation.formErrors.length > 0) {
				setError((prev) => {
					return {
						...prev,
						...serverValidation,
					};
				});
				if (passwordRefs?.current) {
					for (let i = 0; i < passwordRefs.current.length; i++) {
						passwordRefs.current[i].value = '';
					}
				}
			} else {
				if (modal) {
					setContent(modal);
				}
				setShowModal(true);
			}
		}
	}, [serverValidation, setError, passwordRefs, setContent, setShowModal, modal]);

	const onChangeHandler = useCallback(
		async (event: React.FormEvent<HTMLElement>) => {
			const formData = ref.current ? new FormData(ref.current) : new FormData();
			const inputElement = event.target as HTMLInputElement;
			const { id, value } = inputElement;
			if (inputElement) {
				const result = validatateRawFormDataAgainstSchema(schema, formData);
				setValues((prev) => ({ ...prev, [id]: value }));
				if (!result.success) {
					const errors = result.error.flatten();
					setError((prev) => {
						let fieldErrors =
							id in errors.fieldErrors
								? { ...prev?.fieldErrors, [id]: errors.fieldErrors[id] }
								: { ...prev?.fieldErrors, [id]: undefined };

						return {
							formErrors: [...errors.formErrors],
							fieldErrors,
						};
					});
				} else {
					setError((_) => INITIAL_ERROR_STATE);
				}
			}
		},
		[setError, schema]
	);

	return (
		<form ref={ref} action={formAction}>
			<FormContext.Provider value={{ onChangeHandler, error, values, isChanged }}>{children}</FormContext.Provider>
		</form>
	);
};

export function useForm() {
	const context = useContext(FormContext);
	if (!context) throw new Error('useForm hook has to be used within a FormProvider');
	return context;
}

export default FormProvider;
