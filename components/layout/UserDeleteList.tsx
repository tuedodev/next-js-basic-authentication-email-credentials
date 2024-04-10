'use client';

import { searchAction } from '@/lib/session';
import ModalProvider from '../context/ModalProvider';
import UserDeleteItem from './UserDeleteItem';
import { useEffect, useRef, useState } from 'react';
import Search from '../icons/Search';
import { useFormState } from 'react-dom';
import { UserWithReferences } from '@/lib/types';
import { deleteUser } from '@/lib/databaseQueries';

type Props = {
	allUsers: UserWithReferences[];
};

const UserDeleteList: React.FC<Props> = ({ allUsers: initAllUsers }) => {
	const [allUsers, setAllUsers] = useState<UserWithReferences[]>(initAllUsers);
	const [state, formAction] = useFormState(searchAction, null);
	const formEl = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state) {
			setAllUsers((prev) => [...state]);
		}
	}, [state, setAllUsers]);

	function onChangeHandler(event: React.FormEvent<HTMLInputElement>) {
		const form = event.currentTarget.form;
		if (form) {
			form.requestSubmit();
		}
	}

	return (
		<>
			<nav className="grid grid-cols-[min(100%,_560px)] justify-center my-6">
				<form action={formAction} ref={formEl} className="relative flex w-full flex-wrap items-center">
					<input
						onChange={onChangeHandler}
						type="search"
						name="search"
						className="relative m-0 block w-[1px] min-w-0 flex-auto rounded border border-solid border-white/10 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-surface text-white transition duration-300 ease-in-out focus:border-primary focus:text-gray-200 focus:shadow-inset focus:outline-none motion-reduce:transition-none placeholder:text-neutral-300 autofill:shadow-autofill"
						placeholder="Search"
						aria-label="Search"
						aria-describedby="basic-search"
					/>
					<Search
						id="basic-search"
						className="flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-gray-600 dark:text-white [&>svg]:w-5"
					/>
				</form>
			</nav>
			{allUsers.length > 0 && (
				<ul className="space-y-4 text-left text-gray-400 w-full">
					<ModalProvider>
						{allUsers.map((user) => {
							return (
								<UserDeleteItem
									key={user.id}
									status={user.status.name}
									role={user.role.name}
									fields={[user.email, user.firstname, user.lastname]}
									id={user.id}
									deleteUser={deleteUser}
								/>
							);
						})}
					</ModalProvider>
				</ul>
			)}
		</>
	);
};

export default UserDeleteList;
